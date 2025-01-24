import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { Label } from '~/components/ui/label';
// import { useToast } from '~/components/ui/toast';
import { Link, router, useRouter } from 'expo-router';
import { useAuth } from '~/app/_layout';

const signInSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function SignIn() {
  //   const { toast } = useToast();
  const { signIn } = useAuth();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: signInSchema,
    onSubmit: (values) => {
      console.log('Sign in:', values);

      const mockUserType = values.email.includes('hotel')
        ? 'hotel'
        : values.email.includes('driver')
          ? 'driver'
          : 'regular';

      console.log('User type:', mockUserType);

      signIn(mockUserType);

      //   toast({ title: 'Success', description: 'Signed in successfully!' });
    },
  });

  const router = useRouter();

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold text-center mb-6">Sign In</Text>

      <View className="gap-4">
        <View>
          <Label>Email</Label>
          <Input
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={formik.handleChange('email')}
            value={formik.values.email}
          />
          {formik.errors.email && <Text className="text-red-500">{formik.errors.email}</Text>}
        </View>

        <View>
          <Label>Password</Label>
          <Input
            placeholder="********"
            secureTextEntry
            onChangeText={formik.handleChange('password')}
            value={formik.values.password}
          />
          {formik.errors.password && <Text className="text-red-500">{formik.errors.password}</Text>}
        </View>

        <Button onPress={() => formik.handleSubmit()}>
          <Text className="text-primary-foreground">Sign In</Text>
        </Button>
      </View>
      <Button variant={'outline'} className="mt-4" onPress={() => router.push('/(auth)/sign-up')}>
        <Text className="text-blue-500">Sign up</Text>
      </Button>
    </ScrollView>
  );
}