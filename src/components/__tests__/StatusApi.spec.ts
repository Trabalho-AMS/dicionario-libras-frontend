import { describe, it, expect, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import StatusApi from '../StatusApi.vue'
import { statusApi } from '@/services/api'

describe('StatusApi', () => {
  it('mostra "online" quando a API responde ok', async () => {
    vi.spyOn(statusApi, 'verificar').mockResolvedValue({ status: 'ok', servico: 'teste' })
    const wrapper = mount(StatusApi)
    await flushPromises()
    expect(wrapper.text()).toContain('online')
  })

  it('mostra "indisponível" quando a API falha', async () => {
    vi.spyOn(statusApi, 'verificar').mockRejectedValue(new Error('falhou'))
    const wrapper = mount(StatusApi)
    await flushPromises()
    expect(wrapper.text()).toContain('indisponível')
  })
})
