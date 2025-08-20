import { useState, useEffect } from 'react';
import { json, useLoaderData, useActionData, useNavigate } from '@remix-run/react';
import { LoaderFunctionArgs, ActionFunctionArgs } from '@remix-run/node';
import { getSession } from '~/sessions';
import { useForm } from 'react-hook-form';

// Type definitions
interface Activity {
  activity_id: number;
  activity_name: string;
  description: string;
  start_time: string;
  end_time: string;
  location: string; // Adjusted to match backend response
}

interface LoaderData {
  activities: Activity[];
  userRole: string;
  error?: string;
}

interface ActionData {
  error?: string;
  success?: string;
}

interface FormData {
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  location_id: number;
}

// Loader to fetch activities and user role
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  const token = session.get('token');
  const userRole = session.get('role') || 'guest';

  console.log('Loader: Token:', token, 'UserRole:', userRole); // Log session data

  try {
    const response = await fetch('http://localhost:8000/activities', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Loader: Failed to fetch activities: ${response.status} ${errorText}`);
      return json({ activities: [], userRole, error: `Failed to fetch activities: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    console.log('Loader: Fetched activities:', data); // Log fetched data
    return json({ activities: data.activities, userRole });
  } catch (error) {
    console.error('Loader: Network error:', error);
    return json({ activities: [], userRole, error: 'Network error fetching activities' }, { status: 500 });
  }
}

// Action to handle activity creation
export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request);
  const token = session.get('token');

  if (!token) {
    console.error('Action: No token found in session');
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      start_time: formData.get('start_time'),
      end_time: formData.get('end_time'),
      location_id: parseInt(formData.get('location_id') as string),
    };

    console.log('Action: Creating activity with data:', data); // Log form data

    const response = await fetch('', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Action: Failed to create activity: ${response.status} ${errorText}`);
      return json({ error: `Failed to create activity: ${response.status}` }, { status: response.status });
    }

    const result = await response.json();
    console.log('Action: Activity created:', result); // Log success response
    return json({ success: 'Activity created successfully' });
  } catch (error) {
    console.error('Action: Network error:', error);
    return json({ error: 'Network error creating activity' }, { status: 500 });
  }
}

export default function Activities() {
  const { activities, userRole, error } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();
  const navigate = useNavigate();
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Log activities data in component
  useEffect(() => {
    console.log('Component: Activities data:', activities);
    console.log('Component: User role:', userRole);
    if (error) {
      console.error('Component: Loader error:', error);
    }
  }, [activities, userRole, error]);

  // Close modal and reset form after successful submission
  useEffect(() => {
    if (actionData?.success) {
      setIsModalOpen(false);
      reset();
      navigate('/activities', { replace: true });
    }
  }, [actionData, reset, navigate]);

  const onSubmit = async (data: FormData) => {
    // The action function handles the POST request
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Campus Activities</h1>
        <p className="mt-2 text-gray-600">View and manage campus activities.</p>
      </div>

      {/* Loader Error */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Admin-only Create Activity Button */}
      {userRole === 'owner' && (
        <div className="mb-6">
          <button
            type="button"
            className="hs-button inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            onClick={() => setIsModalOpen(true)}
          >
            Create New Activity
          </button>
        </div>
      )}

      {/* Action Error/Success Messages */}
      {actionData?.error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
          {actionData.error}
        </div>
      )}
      {actionData?.success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
          {actionData.success}
        </div>
      )}

      {/* Activities Table */}
      <div className="hs-card bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activities.length > 0 ? (
                activities.map((activity) => (
                  <tr key={activity.activity_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {activity.activity_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(activity.start_time).toLocaleString()} -{' '}
                      {new Date(activity.end_time).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {activity.location}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No activities available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Activity Modal (Admin Only) */}
      {userRole === 'owner' && (
        <div
          className={`hs-overlay fixed top-0 left-0 z-[60] w-full h-full overflow-x-hidden overflow-y-auto transition-all duration-300 ${
            isModalOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Activity</h2>
                <button
                  type="button"
                  className="hs-button text-gray-500 hover:text-gray-700"
                  onClick={() => setIsModalOpen(false)}
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Activity Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="hs-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      {...register('name', { required: true })}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      className="hs-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      {...register('description', { required: true })}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="start_time"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start Time
                    </label>
                    <input
                      type="datetime-local"
                      id="start_time"
                      className="hs-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      {...register('start_time', { required: true })}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="end_time"
                      className="block text-sm font-medium text-gray-700"
                    >
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      id="end_time"
                      className="hs-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      {...register('end_time', { required: true })}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="location_id"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Location ID
                    </label>
                    <input
                      type="number"
                      id="location_id"
                      className="hs-input mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      {...register('location_id', { required: true })}
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-2">
                  <button
                    type="button"
                    className="hs-button px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="hs-button px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                  >
                    Create Activity
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}