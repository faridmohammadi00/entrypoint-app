export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  DrawerNavigator: undefined;
  Buildings: undefined;
  CreateBuilding: undefined;
  EditBuilding: { buildingId: string };
  AddDoormanScreen: undefined;
  EditDoormanScreen: { doormanId: string };
  Visitors: undefined;
  CreateVisitor: undefined;
  EditVisitor: { visitorId: string };
  VisitsReport: { refresh?: boolean };
  CreateVisit: undefined;
  EditVisit: { visitId: string };
  Dashboard: undefined;
  QRScanner: undefined;
};

export type DrawerParamList = {
  Dashboard: undefined;
  Users: undefined;
  Buildings: undefined;
  'Visits Report': undefined;
  Visitors: undefined;
  Pricing: undefined;
  Settings: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
