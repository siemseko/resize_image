'use client';

import { useState } from 'react';

import { Box, IconButton, InputAdornment } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { useForm } from 'react-hook-form';
import { Form, Field } from 'src/components/hook-form';
import { useRouter } from 'src/routes/hooks';
import { Iconify } from 'src/components/iconify';

const USER = {
  email: 'admin@example.com',
  password: '123456',
};

export function JwtSignInView() {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const methods = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: any) => {
    setError('');
    const { email, password } = data;

    if (email === USER.email && password === USER.password) {
      const authData = {
        email,
        isAuthenticated: true,
        timestamp: new Date().toISOString(),
      };

      localStorage.setItem('auth', JSON.stringify(authData));
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <Box gap={1.5} display="flex" flexDirection="column">
      <Form methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Box gap={3} display="flex" flexDirection="column">
          <Field.Text
            name="email"
            label="Email address"
            required
          />

          <Field.Text
            name="password"
            label="Password"
            placeholder="6+ characters"
            type={showPassword ? 'text' : 'password'}
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword((prev) => !prev)}
                    edge="end"
                  >
                    <Iconify
                      icon={showPassword ? 'solar:eye-bold' : 'ph:eye-slash-light'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Box color="error.main" fontSize={14}>
              {error}
            </Box>
          )}

          <LoadingButton
            fullWidth
            type="submit"
            variant="contained"
            color="success"
            size="large"
            loading={isSubmitting}
            loadingIndicator="Logging in..."
          >
            Login
          </LoadingButton>
        </Box>
      </Form>
    </Box>
  );
}
