import { expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import LeakyPaywallContent from '../LeakyPaywallContent.vue'

vi.mock('@urql/vue', () => ({
  useMutation: () => ({ executeMutation: vi.fn() }),
}))

it('renders correctly', () => {
  const { getByText, getAllByRole } = render(LeakyPaywallContent, {
    props: {
      config: {
        title: 'Title',
        description: 'Description',
        logo: 'https://example.com/logo.png',
        primaryColor: '#000000',
        dismissible: false,
      },
      email: '',
    },
  })

  expect(getByText('Title')).toBeVisible()
  expect(getByText('Description')).toBeVisible()
  expect(getAllByRole('textbox')).toHaveLength(1)
  expect(getAllByRole('button')).toHaveLength(1)
})
