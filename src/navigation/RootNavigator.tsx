import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Welcome } from '../screens/auth/Welcome/Welcome';
import { Login } from '../screens/auth/Login/Login';
import { Register } from '../screens/auth/Register/Register';
import { DrawerNavigator } from './DrawerNavigator';
import { RootStackParamList } from './types';
import { RootState } from '../store';
import { useSelector } from 'react-redux';
import { CreateBuilding } from '../screens/Buildings/CreateBuilding';
import { EditBuilding } from '../screens/Buildings/EditBuilding';
import { Buildings } from '../screens/Buildings/Buildings';
import { AddDoormanScreen } from '../screens/Doormans/AddDoormanScreen';
import { EditDoormanScreen } from '../screens/Doormans/EditDoormanScreen';
import { Visitors } from '../screens/Visitors/Visitors';
import { CreateVisitor } from '../screens/Visitors/CreateVisitor';
import { EditVisitor } from '../screens/Visitors/EditVisitor';
import { EditVisit } from '../screens/VisitsReport/EditVisit';
import { VisitsReport } from '../screens/VisitsReport/VisitsReport';
import { CreateVisit } from '../screens/VisitsReport/CreateVisit';
import { Dashboard } from '../screens/Dashboard/Dashboard';
import { QRScanner } from '../screens/QRScanner/QRScanner';
const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={token ? 'DrawerNavigator' : 'Welcome'}
        screenOptions={{
          headerShown: false,
        }}>
        {!token ? (
          <>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        ) : (
          <>
            <Stack.Screen name="Buildings" component={Buildings} />
            <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
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
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
