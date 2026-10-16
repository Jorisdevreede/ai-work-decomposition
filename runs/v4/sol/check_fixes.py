"""Offline regression checks for the FIXES order. No model or network calls.
Run from the project root: python3 -B runs/v4/sol/check_fixes.py
"""
import copy
import json
import subprocess
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[3]
sys.path.insert(0, str(ROOT / "tools"))
import fleet_v3 as fleet
import build_jobs_view as view

DIGEST = "## Sources\n[S1] Existing fixture source\n"
SOURCE = ROOT / "runs/v3/sol/13-1022.00__2.json"


def fixture():
    source = json.loads(SOURCE.read_text())
    task = source["tasks"][0]
    task.pop("time_saved_pct", None)
    task.pop("speedup", None)
    template = task["steps"][0]
    steps = []
    for sid, share, scope, fate, remaining in [
            ("s1", 40, "focal_role", "machine", 0),
            ("s2", 40, "focal_role", "person_reviews", 25),
            ("s3", 20, "supplier", "person_does", 100)]:
        step = copy.deepcopy(template)
        step.update(id=sid, actor="buyer" if scope == "focal_role" else "supplier",
                    share_pct=share, labour_scope=scope, fate=fate, remaining_pct=remaining,
                    rung="deterministic" if fate == "machine" else "stays_manual",
                    loop=None, block="integration" if fate == "machine" else "none",
                    shared_step_id="", approval_refs=[], human_gate=False, approver="none")
        steps.append(step)
    steps[0].update(human_gate=True, approver="buyer", approval_refs=["a1"])
    task.update(steps=steps,
                approvals=[dict(id="a1", action_step_id="s1", approved_version="approved invoice version",
                                approval_step_id="s2", approver="buyer")],
                evidence=[dict(claim="Fixture capability", grade="E2", source="[S1]", kind="capability")],
                new_work=dict(already_counted=[dict(description="Review", labour_scope="focal_role",
                                                   hours_per_100_baseline_hours=12.5, counted_step_ids=["s2"])],
                              incremental=[dict(description="Upkeep", labour_scope="focal_role",
                                                hours_per_100_baseline_hours=2)]),
                time_saved_range_pct=dict(low=60, high=80, basis="More exceptions and slower review"))
    return dict(job_code="13-1022.00", tasks=[task], role=source["role"])


class ValidationTests(unittest.TestCase):
    def setUp(self):
        self.answer = fixture()
        self.task = self.answer["tasks"][0]
        self.step = self.task["steps"][0]
        self.facts = [{"uid": self.task["uid"]}]

    def check(self):
        return fleet.checks(self.answer, self.facts, DIGEST)

    def rejected(self, expected):
        errors = self.check()
        self.assertTrue(any(expected in error for error in errors), errors)

    def test_valid(self):
        self.assertEqual(self.check(), [])

    def test_shares_exact(self):
        self.step["share_pct"] -= 1
        self.rejected("expected 100")

    def test_percent_bounds(self):
        for key, value in [("share_pct", -1), ("remaining_pct", 101)]:
            with self.subTest(key=key):
                answer = fixture()
                answer["tasks"][0]["steps"][0][key] = value
                self.assertTrue(fleet.checks(answer, self.facts, DIGEST))

    def test_machine_and_gone_zero(self):
        for fate in ("machine", "gone"):
            self.step.update(fate=fate, remaining_pct=1)
            self.rejected("remaining must be 0")

    def test_loop_iff(self):
        self.step.update(rung="deterministic_plus_loop", loop=None)
        self.rejected("iff loop rung")
        self.step.update(rung="deterministic", loop=dict(purpose="read", input="text", output="fields",
                         check="schema", stop="one call then person", why_not_simpler="free text"))
        self.rejected("iff loop rung")

    def test_judgement(self):
        self.step["block"] = "judgement_step"
        self.rejected("judgement step marked deterministic")

    def test_action_binding(self):
        self.task["approvals"][0]["action_step_id"] = "s3"
        self.rejected("not bound to this action")

    def test_version_binding(self):
        self.task["approvals"][0]["approved_version"] = ""
        self.rejected("lacks version binding")

    def test_machine_gate_cannot_carry_own_time(self):
        self.task["approvals"][0]["approval_step_id"] = "s1"
        self.rejected("no time-counted human approval")

    def test_human_approval_has_positive_time(self):
        self.task["steps"][1]["remaining_pct"] = 0
        self.rejected("no time-counted human approval")

    def test_human_approval_matches_actor(self):
        self.task["steps"][1]["actor"] = "system"
        self.rejected("no time-counted human approval")

    def test_missing_approval_reference(self):
        self.step["approval_refs"] = []
        self.rejected("gate requires approval references")

    def test_unknown_approval_reference(self):
        self.step["approval_refs"] = ["missing"]
        self.rejected("unknown approval")

    def test_orphan_approval(self):
        self.task["approvals"].append(dict(self.task["approvals"][0], id="unused"))
        self.rejected("orphan approval")

    def test_reuse_one_approval_time_for_two_actions(self):
        self.task["steps"][2].update(fate="machine", remaining_pct=0, human_gate=True,
                                     approver="buyer", approval_refs=["a2"])
        self.task["approvals"].append(dict(self.task["approvals"][0], id="a2", action_step_id="s3"))
        self.assertEqual(self.check(), [])
        self.assertEqual(fleet.labour_metrics(self.task)["time_saved_pct"],85.5)

    def test_evidence_kinds(self):
        for kind in ("legal", "benchmark", "survey"):
            for grade in ("E2", "E3"):
                with self.subTest(kind=kind, grade=grade):
                    self.task["evidence"][0].update(kind=kind, grade=grade)
                    self.rejected("E2/E3 needs capability/case")
        self.task["evidence"][0].update(grade="E1")
        self.assertEqual(self.check(), [])

    def test_unknown_source_id(self):
        self.task["evidence"][0]["source"] = "[S999]"
        self.rejected("absent from digest")

    def test_digest_citation_not_definition(self):
        self.assertEqual(fleet.digest_source_ids("Text cites [S2].\n[S1] Real source"), {"1"})

    def test_e2_model_knowledge(self):
        self.task["evidence"][0]["source"] = "model knowledge"
        self.rejected("E2/E3 needs capability/case")

    def test_products_all_scopes_case_insensitive(self):
        self.answer["role"]["altitude"] = "Use salesforce"
        self.rejected("outside evidence")

    def test_missing_scope_schema_blocks(self):
        del self.step["labour_scope"]
        self.rejected("schema")

    def test_conservative_range(self):
        for low, high in [(90, 80), (80, 86)]:
            self.task["time_saved_range_pct"].update(low=low, high=high)
            self.rejected("conservative range")

    def test_external_labour_excluded(self):
        for scope in ("supplier", "customer", "other_role", "system"):
            self.task["steps"][2].update(labour_scope=scope, remaining_pct=0)
            metrics = fleet.labour_metrics(self.task)
            self.assertEqual(metrics["focal_role_share_pct"], 80)
            self.assertEqual(metrics["gross_time_saved_pct"], 87.5)
            self.assertEqual(metrics["time_saved_pct"], 85.5)

    def test_counted_work_not_deducted_twice(self):
        self.assertEqual(fleet.labour_metrics(self.task)["time_saved_pct"],85.5)
        self.task["new_work"]["already_counted"] = []
        self.assertEqual(fleet.labour_metrics(self.task)["time_saved_pct"],85.5)

    def test_external_incremental_not_role_cost(self):
        self.task["new_work"]["incremental"].append(dict(description="Supplier upkeep",labour_scope="supplier",hours_per_100_baseline_hours=20))
        self.assertEqual(fleet.labour_metrics(self.task)["time_saved_pct"],85.5)

    def test_counted_work_needs_time_reference(self):
        self.task["new_work"]["already_counted"][0]["counted_step_ids"] = ["s1"]
        self.rejected("reference remaining labour")

    def test_counted_work_cannot_exceed_residual(self):
        self.task["new_work"]["already_counted"][0]["hours_per_100_baseline_hours"] = 30
        self.rejected("exceed referenced")

    def test_duplicate_uids(self):
        self.answer["tasks"].append(copy.deepcopy(self.task))
        self.rejected("uids differ")

    def test_derived_output_revalidates(self):
        fleet.derive_v4(self.answer)
        self.assertEqual(self.check(), [])
        self.assertEqual(self.task["time_saved_pct"],85.5)
        self.assertAlmostEqual(self.task["speedup"],100/14.5,places=5)


class RunnerTests(unittest.TestCase):
    def test_timeout_reaps_subprocess_group(self):
        real_popen=subprocess.Popen
        children=[]
        def hang(*args, **kwargs):
            child=real_popen([sys.executable,"-c","import time;time.sleep(10)"],**kwargs)
            children.append(child)
            return child
        with tempfile.TemporaryDirectory() as directory, patch.object(fleet.subprocess,"Popen",side_effect=hang), patch.object(fleet,"TIMEOUT",.05):
            with self.assertRaises(subprocess.TimeoutExpired):
                fleet.run_codex("sol","fixture","{}",directory)
        self.assertIsNotNone(children[0].poll())


class PublicationTests(unittest.TestCase):
    def run_batch(self, candidates):
        schema = json.dumps(fleet.load(fleet.SCHEMA))
        facts = [{"uid": fixture()["tasks"][0]["uid"]}]
        job = dict(code="13-1022.00", title="Buyer", function="Procurement")
        with tempfile.TemporaryDirectory() as directory:
            with patch.object(fleet, "ROOT", directory), patch.object(fleet, "digest_for", return_value=DIGEST), patch.object(fleet,"codex_tool_calls",return_value=[]), patch.object(fleet,"run_codex",side_effect=[(x, "fixture") for x in candidates]) as runner:
                result = fleet.job_batch("sol", job, 1, facts, "fixture", schema)
                out = Path(directory)/"runs/v4/sol/13-1022.00__1.json"
                blocked = out.with_name("13-1022.00__1.blocked.json")
                return result, json.loads(out.read_text()) if out.exists() else None, json.loads(blocked.read_text()) if blocked.exists() else None, runner.call_args_list

    def test_invalid_file_never_published(self):
        bad = fixture(); bad["tasks"][0]["steps"][0]["remaining_pct"] = 1
        result, published, blocked, calls = self.run_batch([bad, bad])
        self.assertIsNone(published)
        self.assertTrue(blocked["_meta"]["checks"])
        self.assertIn("blocked", result)
        self.assertIn("remaining must be 0", calls[1].args[1])

    def test_repaired_candidate_published_and_block_removed(self):
        bad = fixture(); bad["tasks"][0]["steps"][0]["share_pct"] -= 1
        result, published, blocked, calls = self.run_batch([bad, fixture()])
        self.assertIsNone(blocked)
        self.assertEqual(published["_meta"]["checks"], [])
        self.assertEqual(published["tasks"][0]["time_saved_pct"],85.5)

    def test_no_json_is_blocked(self):
        result, published, blocked, _ = self.run_batch([None, None])
        self.assertIsNone(published)
        self.assertIn("no valid JSON", blocked["_meta"]["checks"][0])


class WeightingTests(unittest.TestCase):
    def test_frequency_interpolation_and_defaults(self):
        self.assertEqual(view.frequency_weight(3.5),3.25)
        self.assertEqual(view.frequency_weight(7),10)
        self.assertEqual(view.task_weight(None,None),12)
        self.assertEqual(view.frequency_weight(0),4)

    def test_weighted_summary(self):
        tasks = []
        for weight, remaining, fate in [(9,0,"machine"),(1,100,"person_does")]:
            tasks.append(dict(task_weight=weight, steps=[dict(share_pct=100,remaining_pct=remaining,fate=fate,block="none",rung="deterministic")]))
        summary = view.summary(tasks)
        self.assertEqual(summary["hours_by_fate"]["machine"]["baseline_hours"],90)
        self.assertEqual(summary["hours_by_fate"]["person_does"]["remaining_hours"],10)


class BuilderIntegrationTests(unittest.TestCase):
    def test_all_existing_jobs_reconcile_in_scratch_directory(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root/"prototypes/data").mkdir(parents=True)
            (root/"config").symlink_to(ROOT/"config",target_is_directory=True)
            (root/"runs").symlink_to(ROOT/"runs",target_is_directory=True)
            (root/"prototypes/data/task-table.json").symlink_to(ROOT/"prototypes/data/task-table.json")
            view.build(root)
            index=view.read(root/"prototypes/data/jobs/index.json")
            self.assertTrue(index["jobs"])
            for record in index["jobs"]:
                job=view.read(root/f"prototypes/data/jobs/{record['code']}.json")
                self.assertAlmostEqual(sum(t["task_share_pct"] for t in job["tasks"]),100,places=5)
                fates=job["summary"]["hours_by_fate"].values()
                self.assertAlmostEqual(sum(f["baseline_hours"] for f in fates),100,places=3)
                remaining=sum(f["remaining_hours"] for f in fates)
                self.assertAlmostEqual(record["time_saved_pct"],100-remaining,places=3)

    def test_original_numeric_frequency_and_label_fallback(self):
        facts=view.task_facts(ROOT)
        fact=facts["11-1011.00:8823"]
        self.assertEqual(fact["frequency"],3.58)
        self.assertAlmostEqual(fact["task_weight"],4.52*(2.5+.58*1.5))
        with tempfile.TemporaryDirectory() as directory:
            facts=view.task_facts(ROOT,Path(directory))
            fact=facts["11-1011.00:8823"]
            self.assertEqual(fact["frequency"],4)
            self.assertEqual(fact["task_weight"],4.52*4)


if __name__ == "__main__":
    unittest.main(verbosity=2)
