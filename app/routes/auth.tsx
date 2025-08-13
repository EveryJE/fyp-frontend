import React from 'react';
import { AuthPage } from '~/components/auth/auth-page';

export default function AuthRoute() {
    return (
        <AuthPage onSuccess={() => {
            // On success, navigate to home or dashboard via location.
            window.location.assign('/');
        }} />
    );
}
