# Images Optimizer Pro

![Version](https://img.shields.io/npm/v/smart-image-optimizer)

A command-line interface tool to optimize images (JPG, PNG, SVG) for web performance. This tool helps reduce the file size of your images without compromising quality, making your websites load faster.

## Features

- Batch optimization for directories of images.
- Supports JPG, PNG, and SVG formats.
- Adjustable quality settings for JPG and PNG compression.
- Simple and user-friendly command-line interface.

## Installation

You can install the Smart Image Optimizer CLI globally using npm:

```bash
npm install -g images-optimizer-pro
```

## Usage

You can use the CLI to optimize images either by specifying a file or a directory. The optimized images will be saved in the specified output directory.

```bash
optimize-images [options]
```

## Options

- `-f`, `--file <path>`: Path to a single image file to optimize - relative path.
- `-d`, `--directory <path>`: Directory containing images to optimize (default: `./images`).
- `-o`, `--output <path>`: Directory to save optimized images (default: `./optimized`).
- `-q`, `--quality <number>`: Quality for JPG and PNG compression (0-100, default: 80).

## Examples

### Optimize a Single Image

```bash
optimize-images -f "C:/path/image.jpg" -o "C:/path/optimized" -q 75
```

### Optimize All Images in a Directory ( With Sub Folders)

```bash
optimize-images -d "C:/path/to/assets" -o "C:/path/to/optimized" -q 75
```

## Important Notes

- Ensure you are using absolute paths for both input files and output directories.
- Make sure the output directory exists or the tool has permission to create it.
- If optimizing a directory, the tool will process all images with supported formats within that directory.

## Contributing

Contributions are welcome! If you have suggestions for improvements or bug fixes, please open an issue or submit a pull request.

If you'd like to connect or follow my work, check out my [GitHub profile](https://github.com/vigneshpamu).
