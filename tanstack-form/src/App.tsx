import { useForm } from '@tanstack/react-form'

interface FormValues {
  username : string
  email : string
  password : string
}

function App() {
  const form = useForm<FormValues>({
    defaultValues : {
      username : '',
      email : '',
      password : ''
    },
    onSubmit : ({value}) => {
      console.log(value)
    }
  })

  return (
    <div className='bg-gray-600 h-screen flex justify-center items-center'>
      <form
        onSubmit={
          (e) => {
            e.preventDefault()
            e.stopPropagation() // Prevents the form from being submitted
            void form.handleSubmit() // we need to use void because the function returns a promise
          }
        }
      >
        <div>
          <form.Field
            name="username"
            validators={{
              onChange : ({value}) => {
                if (value.length < 3) {
                  return 'Username must be at least 3 characters long'
                }
              },
              onChangeAsyncDebounceMs : 500, // Debounce the async validation by 500ms meaning that the async validation will only run after 500ms of the last change
              onChangeAsync : async ({value}) => { // Async validation means that the validation function returns a promise
                await new Promise((resolve) => setTimeout(resolve, 1000))
                if (value === 'admin') {
                  return 'Username is already taken'
                }
              } 
            }}
            children={(field) => {
              return (
                <>
                  <label htmlFor={field.name}>First Name: </label>
                  <input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    type="text" 
                  />
                </>
              )
            }}
          /> 
        </div>

        <form.Subscribe
          selector = {(state) => [state.canSubmit, state.isSubmitting]}
          children = {([canSubmit, isSubmitting]) => (
            <button
              type="submit"
              disabled={!canSubmit}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          )}
        />
      </form>
    </div>
  )
}

export default App
