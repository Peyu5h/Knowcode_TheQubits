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
// import { useToast } from '~/components/ui/toast';

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
  //   const { toast } = useToast();
  const { signIn } = useAuth();
  const [activeTab, setActiveTab] = React.useState('regular');

  const regularUserForm = useFormik<RegularUserForm>({
    initialValues: {
      name: '',
      email: '',
      age: 0,
      gender: 'male',
      password: '',
    },
    validationSchema: regularUserSchema,
    onSubmit: (values) => {
      console.log('Regular user signup:', values);
      signIn('regular');
      //   toast({ title: 'Success', description: 'Account created!' });
    },
  });

  const serviceProviderForm = useFormik({
    initialValues: {
      businessName: '',
      email: '',
      password: '',
      serviceType: 'hotel',
    },
    validationSchema: serviceProviderSchema,
    onSubmit: (values) => {
      console.log('Service provider signup:', values);
      signIn(values.serviceType as UserType);
      //   toast({ title: 'Success', description: `${values.serviceType} account created!` });
    },
  });

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Text className="text-2xl font-bold text-center mb-6">Create Account</Text>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-col gap-1.5">
        <TabsList className="flex-row w-full bg-muted mb-6">
          <TabsTrigger
            value="regular"
            className="flex-1 p-3 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Text className="text-sm font-medium">Regular User</Text>
          </TabsTrigger>
          <TabsTrigger
            value="service"
            className="flex-1 p-3 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm"
          >
            <Text className="text-sm font-medium">Business Account</Text>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="regular" className="mt-2">
          <View className="gap-4">
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

            <Button onPress={() => regularUserForm.handleSubmit()}>
              <Text className="text-primary-foreground">Sign Up</Text>
            </Button>
          </View>
        </TabsContent>

        <TabsContent value="service" className="mt-2">
          <View className="gap-4">
            <View>
              <Label>
                <Text>Business Name</Text>
              </Label>
              <Input
                placeholder="Your Business Name"
                onChangeText={serviceProviderForm.handleChange('businessName')}
                value={serviceProviderForm.values.businessName}
              />
              {serviceProviderForm.errors.businessName && (
                <Text className="text-red-500">{serviceProviderForm.errors.businessName}</Text>
              )}
            </View>

            <View>
              <Label>
                <Text>Service Type</Text>
              </Label>
              <RadioGroup
                value={serviceProviderForm.values.serviceType}
                onValueChange={(value) => serviceProviderForm.setFieldValue('serviceType', value)}
              >
                <View className="flex-row gap-4">
                  {['hotel', 'driver'].map((value) => (
                    <View key={value} className="flex-row gap-2 items-center">
                      <RadioGroupItem value={value} />
                      <Label className="capitalize">{value}</Label>
                    </View>
                  ))}
                </View>
              </RadioGroup>
            </View>

            <View>
              <Label>
                <Text>Email</Text>
              </Label>
              <Input
                placeholder="business@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={serviceProviderForm.handleChange('email')}
                value={serviceProviderForm.values.email}
              />
              {serviceProviderForm.errors.email && (
                <Text className="text-red-500">{serviceProviderForm.errors.email}</Text>
              )}
            </View>

            <View>
              <Label>
                <Text>Password</Text>
              </Label>
              <Input
                placeholder="********"
                secureTextEntry
                onChangeText={serviceProviderForm.handleChange('password')}
                value={serviceProviderForm.values.password}
              />
              {serviceProviderForm.errors.password && (
                <Text className="text-red-500">{serviceProviderForm.errors.password}</Text>
              )}
            </View>

            <Button onPress={() => serviceProviderForm.handleSubmit()}>
              <Text className="text-primary-foreground">Create Business Account</Text>
            </Button>
          </View>
        </TabsContent>
      </Tabs>
    </ScrollView>
  );
}
