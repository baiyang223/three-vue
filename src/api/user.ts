import service from '@/utils/request'
import type { user } from '@/types/user'

class UserService {
  login(userInfo: user) {
    return service.post('tokens', { phone_number: userInfo.phone, code: userInfo.code })
  }

  getCode(phone: string) {
    return service.post('short_messages', { phone_number: phone })
  }
}

export default new UserService()
