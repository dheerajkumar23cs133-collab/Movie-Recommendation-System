#!/usr/bin/env python3
"""
Setup script for Render deployment.
Copies model files from git repository to persistent disk.
"""
import os
import shutil
from pathlib import Path

def setup_render():
    """Copy model files to Render disk for persistence."""
    # Source paths (from git repository)
    source_model_dir = Path(__file__).parent.parent.parent / "model"
    
    # Destination paths (Render disk)
    dest_model_dir = Path("/opt/render/project/data/model")
    dest_cache_dir = Path("/opt/render/project/data/cache")
    
    # Create destination directories
    dest_model_dir.mkdir(parents=True, exist_ok=True)
    dest_cache_dir.mkdir(parents=True, exist_ok=True)
    
    # Copy model files
    model_files = ["movies.pkl", "similarity.pkl"]
    for file_name in model_files:
        source_file = source_model_dir / file_name
        dest_file = dest_model_dir / file_name
        
        if source_file.exists():
            print(f"Copying {file_name} to disk...")
            shutil.copy2(source_file, dest_file)
            print(f"✓ {file_name} copied successfully")
        else:
            print(f"⚠ {file_name} not found in source, skipping")
    
    print("Render setup complete!")

if __name__ == "__main__":
    setup_render()
