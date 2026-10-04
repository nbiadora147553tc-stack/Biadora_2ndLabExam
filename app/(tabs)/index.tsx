import { Redirect } from 'expo-router';

// Keep the starter's original route file, but send it through the protected portal route.
export default function LegacyHomeRoute() {
  return <Redirect href="/(app)" />;
}
