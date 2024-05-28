import { fireEvent, render } from '@testing-library/vue'
import { expect, it } from 'vitest'
import MonitorForm from './MonitorForm.test.vue'

it('can monitor form submit', async () => {
  const onSubmit = vi.fn()
  const onMonitor = vi.fn()
  const { getByRole } = render(MonitorForm, {
    props: {
      onSubmit,
      onMonitor,
    },
  })

  const input = getByRole('textbox')
  const button = getByRole('button')

  await fireEvent.update(input, 'demo@example.com')
  await fireEvent.click(button)

  expect(onSubmit).toHaveBeenCalled()
  expect(onMonitor).toHaveBeenCalledWith('demo@example.com')
})
