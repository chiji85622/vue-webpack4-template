
import {sum} from '@/demo'

describe('HelloWorld.vue', () => {
  it('should render correct contents', () => {
  

      expect(sum(2,3))
      .toEqual(5)
  })
})