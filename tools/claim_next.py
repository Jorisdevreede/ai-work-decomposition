#!/usr/bin/env python3
"""Claim the next unanswered batch-3 prompt for a pane: prints its name, or DONE.

Usage: python3 tools/claim_next.py <pane-id>     (or --peek: count unanswered prompts, claims nothing)
A claim is a directory runs/v5/claims/<name> (mkdir is atomic, so two panes never get the same prompt).
Prompts come in manifest order (largest US employment first). A prompt is done when any
runs/v5/<label>/<name>.json or .blocked.json exists. A claim older than 90 minutes without an answer is
stale and can be taken over by another pane.
"""
import json
import os
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
V5 = ROOT / "runs" / "v5"
CLAIMS = V5 / "claims"
STALE = 90 * 60


def answered(name):
    return any((d / f"{name}.json").exists() or (d / f"{name}.blocked.json").exists()
               for d in V5.iterdir() if d.is_dir() and d.name not in ("prompts", "claims"))


def main():
    pane = sys.argv[1] if len(sys.argv) > 1 else "unknown"
    manifest = json.loads((V5 / "prompts" / "manifest.json").read_text())
    if pane == "--peek":  # read-only: how many prompts have no answer yet
        left = sum(1 for item in manifest if not answered(item["name"]))
        print("DONE" if left == 0 else f"{left} left")
        return
    CLAIMS.mkdir(parents=True, exist_ok=True)
    for item in manifest:
        name = item["name"]
        if answered(name):
            continue
        claim = CLAIMS / name
        try:
            claim.mkdir()
        except FileExistsError:
            owner_file = claim / "owner"
            owner = owner_file.read_text().split()[0] if owner_file.exists() else ""
            if owner != pane and time.time() - claim.stat().st_mtime < STALE:
                continue
            os.utime(claim)  # own claim (resume it) or a stale claim (take it over)
        (claim / "owner").write_text(f"{pane} {time.strftime('%Y-%m-%d %H:%M')}\n")
        print(name)
        return
    print("DONE")


if __name__ == "__main__":
    main()
