import EmailForm from '../EmailForm.vue'

vi.mock('@urql/vue', () => ({
  useMutation: () => ({ executeMutation: vi.fn() }),
}))

it('can render form', async () => {
  const { getByRole } = render(EmailForm, {
    props: {
      email: 'demo@example.com',
    },
  })

  const emailInput = getByRole('textbox')
  const submitButton = getByRole('button')

  expect(emailInput).toBeVisible()
  expect(submitButton).toBeVisible()

  await fireEvent.update(emailInput, 'test@example.com')

  expect(emailInput).toHaveValue('test@example.com')
})
