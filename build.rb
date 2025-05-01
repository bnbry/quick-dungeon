require "fileutils"

# naive build script
VERSION = "v0.0.4"
SOURCE_PATH = "./src"
BUILD_PATH = "./build"

# clear the build dir
Dir.foreach(BUILD_PATH) do |f|
  file_name = File.join(BUILD_PATH, f)
  File.delete(file_name) if f != '.' && f != '..'
end

# version and copy source files to build dir
Dir.foreach(SOURCE_PATH) do |f|
  source_file = File.join(SOURCE_PATH, f)

  next unless File.file?(source_file)

  extension = File.extname(source_file)
  base_name = File.basename(source_file, extension)
  build_file = File.join(BUILD_PATH, "#{base_name}-#{VERSION}#{extension}")

  FileUtils.cp(source_file, build_file)
end

# replace versions in base index with new version
INDEX_FILE = "./index.html"
index_content = File.read(INDEX_FILE)
updated_content = index_content.gsub(/v\d\.\d\.\d/, VERSION)

File.write(INDEX_FILE, updated_content)
