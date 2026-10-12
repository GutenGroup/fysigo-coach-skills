---
payload: |
  {
    "schemaVersion": 1,
    "type": "corrective",
    "metadata": {
      "name": "Anterior Tilt Reset",
      "duration_weeks": 6,
      "principle_md": "Restore neutral pelvis under load so the lower back stops compensating for what the hips won't do."
    },
    "from_coach": {
      "problem_md": "Eight hours a day at a desk has shortened your hip flexors and switched off your glutes. Your pelvis tilts forward, your lumbar spine extends to compensate, and by 5pm your lower back is the loudest part of your body. The squat and deadlift load this same pattern under heavy weight twice a week — which is why the pain is loudest on training days.",
      "why_gym_alone_md": "Squats and deadlifts are not the cause, but they reinforce the pattern when the hips can't extend properly. Adding more sets won't fix the angle; it just adds reps at the wrong angle.",
      "what_correctives_do_md": "Three things, in this order: lengthen the front of the hip, wake up the glutes and deep abdominals, then retrain neutral pelvis under load. Every drill here serves one of those three jobs.",
      "why_this_approach_md": "Generic mobility routines stretch what already moves. This program targets the specific tissues that are locking your pelvis forward and trains the ones that should be holding it neutral — in that order, because mobilizing without re-stabilizing leaves you worse off.",
      "what_to_expect_md": "Weeks 1-2: hip flexor length and breath mechanics improve, end-of-day back pain still present but shorter. Weeks 3-4: glutes start firing on demand, you'll feel them on squat day. Weeks 5-6: neutral pelvis under load; 5pm should be quiet.",
      "signature": {
        "name": "Dr. Jane Smith",
        "title": "DPT",
        "date": "2026-05-26"
      }
    },
    "volume_targets": [
      {
        "category": "hip-mobility",
        "category_label": "Hip Mobility",
        "description_md": "Open the front of the hip so the pelvis can sit neutral. These are length, not strength.",
        "weekly_targets": [
          {
            "id": "couch-stretch",
            "name": "Couch Stretch",
            "target_count": 4,
            "unit": "sessions",
            "duration_per": "2 min per side",
            "instructions_md": "Back foot on the couch, front foot flat, hips square. Squeeze the glute of the back leg to drive the stretch into the hip flexor, not the quad. Breathe out slowly for 8 seconds at end-range.",
            "why_md": "Lengthens psoas and rectus femoris — the two tissues pulling your pelvis forward.",
            "tags": ["daily", "priority"]
          },
          {
            "id": "90-90-hip-rotation",
            "name": "90/90 Hip Rotation",
            "target_count": 3,
            "unit": "sessions",
            "duration_per": "5 min total",
            "instructions_md": "Sit with front shin and back shin both at 90°. Lift the back knee an inch, lower with control, then rotate the whole stack to the other side. Slow, no momentum.",
            "why_md": "Trains hip internal and external rotation simultaneously — the range your desk took away.",
            "tags": ["priority"]
          }
        ]
      },
      {
        "category": "glute-activation",
        "category_label": "Glute Activation",
        "description_md": "Wake up the muscles that should be holding your pelvis neutral. Low load, high intent.",
        "weekly_targets": [
          {
            "id": "single-leg-glute-bridge",
            "name": "Single-Leg Glute Bridge",
            "target_count": 3,
            "unit": "sessions",
            "duration_per": "3x10 per side",
            "instructions_md": "Lie on your back, one foot flat, other knee pulled to chest. Drive through the heel of the planted foot until your body is in a straight line from knee to shoulder. Pause 2 seconds at the top, focus on the squeeze, not the height.",
            "why_md": "Isolates the glute without letting the lower back take over.",
            "tags": ["unilateral"]
          },
          {
            "id": "banded-clamshell",
            "name": "Banded Clamshell",
            "target_count": 4,
            "unit": "sessions",
            "duration_per": "2x15 per side",
            "instructions_md": "Side-lying, band above the knees, heels together. Rotate the top knee open without rocking your hips back. Slow on the way down.",
            "why_md": "Targets glute medius — the stabilizer your pelvis is missing.",
            "tags": ["unilateral", "daily"]
          }
        ]
      },
      {
        "category": "breathing",
        "category_label": "Breathing",
        "description_md": "Anchor the ribcage over the pelvis so the deep abdominal wall can do its job.",
        "weekly_targets": [
          {
            "id": "90-90-breathing",
            "name": "90/90 Breathing",
            "target_count": 5,
            "unit": "sessions",
            "duration_per": "5 breaths x 4 rounds",
            "instructions_md": "Lie on your back, feet on a wall, hips and knees at 90°. Exhale fully through pursed lips for 8 seconds — feel the lower ribs draw down. Inhale 4 seconds through the nose, expanding the lower back into the floor. Pause 2 seconds before the next exhale.",
            "why_md": "Resets ribcage position and recruits the deep abdominal wall — the muscle group most missing in anterior tilt.",
            "tags": ["daily", "priority"]
          }
        ]
      }
    ],
    "inject_into_strength": {
      "enabled": true,
      "target_program_slug": "the-oak-cycle-3",
      "injections": [
        {
          "match": { "workout_type": "regular" },
          "exercises": [
            { "name": "Couch Stretch", "sets": 2, "reps": "2 min per side", "cues_md": "Pre-squat: open the front of the hip before you load it." },
            { "name": "90/90 Breathing", "sets": 1, "reps": "5 breaths x 2 rounds", "cues_md": "Between warm-up sets — reset ribcage, then ramp." }
          ]
        }
      ]
    },
    "missing_piece_md": "This program does not address mid-back stiffness or shoulder position. If 5pm pain shifts upward as the lower back quiets, ask for a follow-up program targeting thoracic extension."
  }
  
---

# Anterior Tilt Reset

> Six-week corrective. Lower-back-friendly, hip-led, breath-driven.

This file is the markdown form of the same payload as `daniel-corrective.json`. Either one uploads to Fysigo — drag whichever you prefer at [/coach/programs/new](https://fysigo.com/coach/programs/new).
