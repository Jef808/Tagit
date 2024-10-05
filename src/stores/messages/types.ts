type Header = {
  name: string,
  value: string
};

type MessagePartBody = {
  size: number,
  data: string
};

type MessagePart = {
  partId: string,
  mimeType: string,
  filename?: string,
  headers: Header[],
  body?: MessagePartBody,
  parts: MessagePart[]
};

export type Message = {
  id: string,
  threadId: string,
  labelIds?: string[],
  internalDate?: string,
  payload?: MessagePart,
  sizeEstimate?: number,
  raw?: string,
};

export type MessageMetadata = {
  id: string,
  threadId: string,
  labelIds?: string[],
  headers?: Header[]
}
