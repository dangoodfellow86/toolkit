import { atom } from 'recoil'

export const editUserModalState = atom({
  key: 'editUserModalState',
  default: {
    isOpen: false,
    userData: null
  }
})
