
// Setting up Tag with tag-name and optional tag colour
export interface Label {
  name: string,
  colour?: string,
  _id?: string, // MongooseObjectId
}

// Setting up Item for easier use in any component
export interface Item {
  _id?: string, // mongoose.Types.ObjectId,
  id?: string, // mongoose.Types.ObjectId,
  name: any,
  description: any,
  bild?: string,
  quantity?: number,
  countable: boolean,
  position?: string,
  available?: boolean,
  labelIds?: string[], // mongoose.Types.ObjectId[]
  labels?: Label[]
}

export interface Items {
  [key:string]: Item
}

export interface User {
  username: string,
  email?: string,
  password: string
}

export interface Room{
  name: {en:string
    de:string},
  ipAddress: string
}

export interface Position {
  shelfNumber: number,
  positionId: number,
  LEDs: number[],
}

export interface Mac{
  mac: string
}
export interface BackendPosition {
  itemId: string,
  number: number,
  quantity: number
  shelfId: string[]
}

export interface Language {
  _id: string,
  lang: string,
  required: boolean,
}

