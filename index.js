#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import sharp from 'sharp'
import { optimize as optimizeSvg } from 'svgo'
import { Command } from 'commander'
import ora from 'ora'

const program = new Command()

program
  .version('1.0.0')
  .description('CLI to optimize images (JPG, PNG, SVG) for web performance.')
  .option('-f, --file <path>', 'Path to the image file to optimize')
  .option(
    '-d, --directory <path>',
    'Directory to optimize images in',
    './images'
  )
  .option(
    '-o, --output <path>',
    'Directory to save optimized images',
    './optimized'
  )
  .option(
    '-q, --quality <number>',
    'Quality for JPG and PNG compression (0-100)',
    '80'
  )
  .parse(process.argv)

const options = program.opts()
const imageFormats = ['jpg', 'jpeg', 'png', 'svg']

async function optimizeImage(filePath, outputDir, quality) {
  const ext = path.extname(filePath).toLowerCase().substring(1)
  const spinner = ora(`Optimizing ${filePath}...`).start()

  try {
    const fileName = path.basename(filePath)
    const outputPath = path.join(outputDir, fileName)

    if (ext === 'jpg' || ext === 'jpeg') {
      await sharp(filePath)
        .jpeg({ quality: parseInt(quality), mozjpeg: true })
        .toFile(outputPath)
    } else if (ext === 'png') {
      await sharp(filePath)
        .png({
          quality: parseInt(quality), // Note: quality is ignored for PNG
          compressionLevel: 9,
          adaptiveFiltering: true,
          palette: true, // This ensures a palette-based PNG is created
        })
        .toFile(outputPath)
    } else if (ext === 'svg') {
      const svgContent = fs.readFileSync(filePath, 'utf8')
      const result = optimizeSvg(svgContent)
      fs.writeFileSync(outputPath, result.data)
    }

    spinner.succeed(`Optimized ${fileName}`)
  } catch (error) {
    spinner.fail(`Failed to optimize ${filePath}: ${error.message}`)
  }
}

async function batchOptimize(directory, outputDir, quality) {
  const absoluteDirectory = path.resolve(directory)
  const absoluteOutputDir = path.resolve(outputDir)

  if (!fs.existsSync(absoluteDirectory)) {
    console.error(`The input directory does not exist: ${absoluteDirectory}`)
    return
  }

  if (!fs.existsSync(absoluteOutputDir)) {
    fs.mkdirSync(absoluteOutputDir, { recursive: true })
  }

  const files = fs.readdirSync(absoluteDirectory)

  for (const file of files) {
    const filePath = path.join(absoluteDirectory, file)
    const fileStats = fs.statSync(filePath)

    if (fileStats.isDirectory()) {
      // Recursively call batchOptimize for subdirectories
      const subOutputDir = path.join(absoluteOutputDir, file)
      await batchOptimize(filePath, subOutputDir, quality)
    } else if (
      imageFormats.includes(path.extname(file).toLowerCase().substring(1))
    ) {
      // Optimize image files
      await optimizeImage(filePath, absoluteOutputDir, quality)
    }
  }

  console.log('Image optimization complete.')
}

;(async () => {
  if (options.file) {
    // If a single file is provided, optimize that file
    await optimizeImage(
      path.resolve(options.file),
      path.resolve(options.output),
      options.quality
    )
  } else {
    // If no file is provided, optimize all images in the directory
    await batchOptimize(options.directory, options.output, options.quality)
  }
})()
