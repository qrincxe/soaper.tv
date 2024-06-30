export interface stream {
    val: string
    vtt: string
    val_bak: string
    pos: number
    type: string
    subs: Sub[]
    ip: string
  }
  
  export interface Sub {
    path: string
    name: string
  }
  