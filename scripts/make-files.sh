FOLDER=apps/file-api/src/assets

extensions=( png webp jpg jpeg mp4 mp3 wav mkv json json5 md txt xml)

FILE_SIZE="1m"

for val in "${extensions[@]}"
do
  FILE_PATH="$FOLDER/generated_file.$val"
  if [ ! -f $FILE_PATH ]; then
    mkfile $FILE_SIZE $FILE_PATH
  fi
done
