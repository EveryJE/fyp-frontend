import { json, redirect } from '@remix-run/react';
     import { ActionFunctionArgs } from '@remix-run/node';
     import { getSession, commitSession } from '~/sessions';
     import { useForm } from 'react-hook-form';

     interface LoginData {
       username: string;
       password: string;
     }

     export async function action({ request }: ActionFunctionArgs) {
       const formData = await request.formData();
       const username = formData.get('username');
       const password = formData.get('password');

       const response = await fetch('http://localhost:8000/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ username, password }),
       });

       if (!response.ok) {
         return json({ error: 'Invalid credentials' }, { status: response.status });
       }

       const { token, role } = await response.json();
       const session = await getSession(request);
       session.set('token', token);
       session.set('role', role);

       return redirect('/activities', {
         headers: {
           'Set-Cookie': await commitSession(session),
         },
       });
     }

     export default function Login() {
       const { register, handleSubmit } = useForm<LoginData>();

       return (
         <div className="max-w-md mx-auto mt-10">
           <h1 className="text-2xl font-bold mb-4">Login</h1>
           <form onSubmit={handleSubmit(() => {})} className="space-y-4">
             <div>
               <label htmlFor="username" className="block text-sm font-medium">
                 Username
               </label>
               <input
                 type="text"
                 id="username"
                 className="hs-input mt-1 block w-full"
                 {...register('username', { required: true })}
               />
             </div>
             <div>
               <label htmlFor="password" className="block text-sm font-medium">
                 Password
               </label>
               <input
                 type="password"
                 id="password"
                 className="hs-input mt-1 block w-full"
                 {...register('password', { required: true })}
               />
             </div>
             <button
               type="submit"
               className="hs-button px-4 py-2 text-white bg-indigo-600 rounded-md"
             >
               Login
             </button>
           </form>
         </div>
       );
     }