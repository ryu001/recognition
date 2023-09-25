export interface Recognition {
  id?: number
  recognitionUserId?: number
  createUserId?: number
  point?: number
  detail?: string
  createdDate?: string
}

export interface Activity {
  recognitionId: number
  recognitionUserName: string
  recognitionCreatedTime: string
  recognitionDetail: string
}
