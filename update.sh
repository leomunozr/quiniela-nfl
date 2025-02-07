URL='https://script.google.com/macros/s/AKfycbxhJHN1L90NjFXecK6i_0AE1ij0zVxfmYC8eTNFrn6Dwi_2NZtpKl_R-UKXL_4glEWkxA/exec?script=respuestas&url=https://docs.google.com/spreadsheets/d/1brEncn8Vcgs_JELkAEOk9Xi7_OYZQ58pCinps4Cq2Ws/edit'

response=$(curl -s -L -H "Accept: application/json" "$URL")

echo $response > src/data/playersData.json

# git add src/data/playersData.json
# git commit -m "Update playersData.json"
# git push

# npm run deploy
