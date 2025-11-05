#!/bin/bash

# Manual test script for generation deletion API
# Make sure the server is running (pnpm run dev) before running this script

echo "🧪 Testing Generation Deletion API"
echo "=================================="
echo ""

# Configuration
API_URL="http://localhost:3000"
TEST_EMAIL="deletetest@example.com"
TEST_PASSWORD="testpassword123"
TEST_USERNAME="deletetester"

echo "1️⃣  Creating test user..."
SIGNUP_RESPONSE=$(curl -s -X POST "$API_URL/auth/signup" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\",\"username\":\"$TEST_USERNAME\"}")

echo "Response: $SIGNUP_RESPONSE"
echo ""

echo "2️⃣  Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
USER_ID=$(echo $LOGIN_RESPONSE | grep -o '"id":[0-9]*' | cut -d':' -f2)

if [ -z "$TOKEN" ]; then
  echo "❌ Failed to get auth token. User might already exist. Try logging in..."
  LOGIN_RESPONSE=$(curl -s -X POST "$API_URL/auth/login" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$TEST_EMAIL\",\"password\":\"$TEST_PASSWORD\"}")
  TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
fi

echo "Token: ${TOKEN:0:20}..."
echo ""

echo "3️⃣  Creating a test generation..."
CREATE_RESPONSE=$(curl -s -X POST "$API_URL/generations" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"prompt":"Test generation for deletion","style":"photorealistic"}')

GENERATION_ID=$(echo $CREATE_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$GENERATION_ID" ]; then
  echo "Response: $CREATE_RESPONSE"
  echo "❌ Failed to create generation. Might be 503 (simulated overload). Trying again..."
  CREATE_RESPONSE=$(curl -s -X POST "$API_URL/generations" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"prompt":"Test generation for deletion","style":"photorealistic"}')
  GENERATION_ID=$(echo $CREATE_RESPONSE | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
fi

if [ -z "$GENERATION_ID" ]; then
  echo "❌ Still failed. Response: $CREATE_RESPONSE"
  exit 1
fi

echo "Generation ID: $GENERATION_ID"
echo ""

echo "4️⃣  Listing generations..."
LIST_RESPONSE=$(curl -s -X GET "$API_URL/generations" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $LIST_RESPONSE"
echo ""

echo "5️⃣  Deleting generation ID: $GENERATION_ID..."
DELETE_RESPONSE=$(curl -s -X DELETE "$API_URL/generations/$GENERATION_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}")

echo "Response: $DELETE_RESPONSE"
echo ""

# Check if deletion was successful
if echo "$DELETE_RESPONSE" | grep -q "200"; then
  echo "✅ Deletion successful!"
else
  echo "❌ Deletion failed!"
fi

echo ""
echo "6️⃣  Verifying deletion (listing again)..."
LIST_AFTER_DELETE=$(curl -s -X GET "$API_URL/generations" \
  -H "Authorization: Bearer $TOKEN")
echo "Response: $LIST_AFTER_DELETE"
echo ""

# Check if the deleted generation is still in the list
if echo "$LIST_AFTER_DELETE" | grep -q "\"id\":$GENERATION_ID"; then
  echo "❌ Generation still exists after deletion!"
else
  echo "✅ Generation successfully removed from list!"
fi

echo ""
echo "7️⃣  Testing deletion of non-existent generation..."
DELETE_NONEXISTENT=$(curl -s -X DELETE "$API_URL/generations/999999" \
  -H "Authorization: Bearer $TOKEN" \
  -w "\nHTTP Status: %{http_code}")
echo "Response: $DELETE_NONEXISTENT"

if echo "$DELETE_NONEXISTENT" | grep -q "404"; then
  echo "✅ Correctly returns 404 for non-existent generation!"
else
  echo "❌ Should return 404!"
fi

echo ""
echo "8️⃣  Testing deletion without auth..."
DELETE_NO_AUTH=$(curl -s -X DELETE "$API_URL/generations/$GENERATION_ID" \
  -w "\nHTTP Status: %{http_code}")
echo "Response: $DELETE_NO_AUTH"

if echo "$DELETE_NO_AUTH" | grep -q "401"; then
  echo "✅ Correctly returns 401 without auth!"
else
  echo "❌ Should return 401!"
fi

echo ""
echo "=================================="
echo "🏁 Test completed!"
