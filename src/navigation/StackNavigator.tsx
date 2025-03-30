import { CreateBuilding } from '../screens/Buildings/CreateBuilding';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { Welcome } from '../screens/auth/Welcome/Welcome';
import { Login } from '../screens/auth/Login/Login';
import { Register } from '../screens/auth/Register/Register';
import { Buildings } from '../screens/Buildings/Buildings';
import { DrawerNavigator } from './DrawerNavigator';
import { EditBuilding } from '../screens/Buildings/EditBuilding';
import { AddDoormanScreen } from '../screens/Doormans/AddDoormanScreen';
import { EditDoormanScreen } from '../screens/Doormans/EditDoormanScreen';
import { Visitors } from '../screens/Visitors/Visitors';
import { CreateVisitor } from '../screens/Visitors/CreateVisitor';
import { EditVisitor } from '../screens/Visitors/EditVisitor';
import { VisitsReport } from '../screens/VisitsReport/VisitsReport';
import { CreateVisit } from '../screens/VisitsReport/CreateVisit';
import { EditVisit } from '../screens/VisitsReport/EditVisit';
import { Dashboard } from '../screens/Dashboard/Dashboard';
import { QRScanner } from '../screens/QRScanner/QRScanner';

const Stack = createNativeStackNavigator<RootStackParamList>();

function StackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="Buildings" component={Buildings} />
      <Stack.Screen name="CreateBuilding" component={CreateBuilding} />
      <Stack.Screen name="EditBuilding" component={EditBuilding} />
      <Stack.Screen name="AddDoormanScreen" component={AddDoormanScreen} />
      <Stack.Screen name="EditDoormanScreen" component={EditDoormanScreen} />
      <Stack.Screen name="Visitors" component={Visitors} />
      <Stack.Screen name="CreateVisitor" component={CreateVisitor} />
      <Stack.Screen name="EditVisitor" component={EditVisitor} />
      <Stack.Screen name="VisitsReport" component={VisitsReport} />
      <Stack.Screen name="CreateVisit" component={CreateVisit} />
      <Stack.Screen name="EditVisit" component={EditVisit} />
      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="QRScanner" component={QRScanner} />
    </Stack.Navigator>
  );
}

export default StackNavigator;
