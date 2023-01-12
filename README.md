# THIS REPOSITORY IS WORK-IN-PROGRESS. IT DOES NOT YET WORK.

# Tiny Animation Retarget System for Babylon.js
This repository was created to assist with the unwieldy animation system of babylon.js.  
Currently, babylon.js does not have any retargeting capabilities, and if you want to handle animations, you must include all animations and models in one file.
It also recognizes only one animation clip, which is pain when creating an application including animated characters.

This repository provides a very simple retargeting system.
It is assumed that the 3D models to be retargeted have approximately the same bind pose and body size.

## How to use
work in progress.

## Progress
- [x] Implement Analyzing and Creating metadata system for Skind mesh.
- [x] Implement core algorithm of Retargeting (Consider only the logical structure of the tree).
- [ ] Implement of interface for adjustments of retargeting.
- [ ] Implement Code-generator for metadata definition files
- [ ] Prepare Sample code.