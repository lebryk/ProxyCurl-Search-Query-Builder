# OpenAI WebRTC API Parameters Guide

This guide summarizes the required parameters and their correct formats for the OpenAI WebRTC API based on error responses.

## Event Type Parameters

### 1. Initial Event Type
```typescript
// Error: Invalid value: 'message'. Supported values are: 'session.update'...
// Changed from:
type: "message"
// To:
type: "conversation.item.create"
```

### 2. Message Item Type
```typescript
// Error: Missing required parameter: 'item.type'
// Changed from:
item: {
  role: "system",
  content: "..."
}
// To:
item: {
  type: "message",  // Added this line
  role: "system",
  content: "..."
}
```

### 3. Content Format
```typescript
// Error: Invalid type for 'item.content': expected an array of objects
// Changed from:
content: "You are a helpful assistant..."
// To:
content: [{
  type: "input_text",  // Initially tried "text", but had to change to "input_text"
  text: "You are a helpful assistant..."
}]
```

### 4. Response Creation
```typescript
// Added response creation after speech detection
const request = {
  type: "response.create",
  response: {
    completion_options: {
      temperature: 0.7
    }
  }
}
```

## Key Takeaways

1. Event types must match OpenAI's WebRTC API exactly
2. Content must be an array of objects
3. Content type must be "input_text"
4. Need to explicitly create a response after speech detection

## Supported Event Types

The following event types are supported by the API:
- `session.update`
- `input_audio_buffer.append`
- `input_audio_buffer.commit`
- `input_audio_buffer.clear`
- `conversation.item.create`
- `conversation.item.truncate`
- `conversation.item.delete`
- `response.create`
- `response.cancel`
