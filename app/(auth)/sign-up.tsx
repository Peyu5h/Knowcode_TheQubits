import { useFormik } from 'formik';
import * as Yup from 'yup';
import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Text } from '~/components/ui/text';
import { Label } from '~/components/ui/label';
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { router } from 'expo-router';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import { useAuth } from '~/app/_layout';
import { useToast } from '~/components/ui/toast';
import { usePlanStore } from '~/lib/store/usePlanStore';
import api from '~/lib/api';
import { ActivityIndicator } from 'react-native';

type UserType = 'regular' | 'hotel' | 'driver';

// Update the Option type to match the component's requirements
type Option = string;

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
] as const;

type Gender = (typeof genderOptions)[number]['value'];

// Update the form schema
const regularUserSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  age: Yup.number().required('Age is required').min(18, 'Must be 18 or older'),
  gender: Yup.string()
    .oneOf(['male', 'female', 'other'] as const)
    .required('Gender is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

type RegularUserForm = Yup.InferType<typeof regularUserSchema>;

const serviceProviderSchema = Yup.object().shape({
  businessName: Yup.string().required('Business name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  serviceType: Yup.string().oneOf(['hotel', 'driver']).required('Service type is required'),
});

export default function SignUp() {
  const { toast } = useToast();
  const { signIn } = useAuth();
  const setUser = usePlanStore((state) => state.setUser);
  const [activeTab, setActiveTab] = React.useState('regular');
  const [loading, setLoading] = React.useState(false);

  const regularUserForm = useFormik<RegularUserForm>({
    initialValues: {
      name: '',
      email: '',
      age: 0,
      gender: 'male',
      password: '',
      phone: '',
    },
    validationSchema: regularUserSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await api.post('user/signUp', {
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password,
          gender: values.gender,
          age: values.age,
        });

        if (response.success) {
          setUser(response.result as any);
          signIn('regular');
          router.replace('/(tabs)/(user)');
        } else {
          toast({
            title: 'Error',
            variant: 'destructive',
            description: response.message || 'Sign up failed',
          });
        }
      } catch (error) {
        toast({
          title: 'Error',
          variant: 'destructive',
          description: 'Failed to create account',
        });
        console.error('Sign up error:', error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold text-center mb-6">Create Account</Text>

      <View className="gap-4">
        <View>
          <Label>Phone</Label>
          <Input
            placeholder="1234567890"
            keyboardType="phone-pad"
            onChangeText={regularUserForm.handleChange('phone')}
            value={regularUserForm.values.phone}
          />
        </View>

        <View>
          <Label>
            <Text>Name</Text>
          </Label>
          <Input
            placeholder="John Doe"
            onChangeText={regularUserForm.handleChange('name')}
            value={regularUserForm.values.name}
          />
          {regularUserForm.errors.name && (
            <Text className="text-red-500">{regularUserForm.errors.name}</Text>
          )}
        </View>

        <View>
          <Label>Email</Label>
          <Input
            placeholder="email@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            onChangeText={regularUserForm.handleChange('email')}
            value={regularUserForm.values.email}
          />
          {regularUserForm.errors.email && (
            <Text className="text-red-500">{regularUserForm.errors.email}</Text>
          )}
        </View>

        <View>
          <Label>
            <Text>Age</Text>
          </Label>
          <Input
            placeholder="25"
            keyboardType="numeric"
            onChangeText={regularUserForm.handleChange('age')}
            value={regularUserForm.values.age.toString()}
          />
          {regularUserForm.errors.age && (
            <Text className="text-red-500">{regularUserForm.errors.age}</Text>
          )}
        </View>

        <View>
          <Label>
            <Text>Gender</Text>
          </Label>
          <RadioGroup
            value={regularUserForm.values.gender}
            onValueChange={(value) => regularUserForm.setFieldValue('gender', value)}
          >
            <View className="flex-row gap-4">
              {genderOptions.map((option) => (
                <View key={option.value} className="flex-row gap-2 items-center">
                  <RadioGroupItem value={option.value} />
                  <Text className="capitalize">{option.label}</Text>
                </View>
              ))}
            </View>
          </RadioGroup>
        </View>

        <View>
          <Label>
            <Text>Password</Text>
          </Label>
          <Input
            placeholder="********"
            secureTextEntry
            onChangeText={regularUserForm.handleChange('password')}
            value={regularUserForm.values.password}
          />
          {regularUserForm.errors.password && (
            <Text className="text-red-500">{regularUserForm.errors.password}</Text>
          )}
        </View>

        <Button onPress={() => regularUserForm.handleSubmit()} disabled={loading}>
          <Text className="text-primary-foreground">
            {loading ? <ActivityIndicator color="#fff" /> : 'Sign Up'}
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
}
