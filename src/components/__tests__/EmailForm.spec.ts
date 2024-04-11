import EmailForm from '../EmailForm.vue'

vi.mock('@urql/vue', () => ({
  useMutation: () => ({ executeMutation: vi.fn() }),
}))

it('can render form', () => {
  const { getByRole } = render(EmailForm, {
    props: {
      email: 'demo@example.com',
    },
  })

  expect(getByRole('textbox', { value: 'demo@example.com' })).toBeVisible()
  expect(getByRole('button')).toBeVisible()
})
