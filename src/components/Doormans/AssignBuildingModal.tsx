import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Modal, Portal, Text, Button, RadioButton } from 'react-native-paper';
import { buildingService } from '../../services/building.service';
import { doormanService, IDoorman } from '../../services/doorman.service';
import { colors } from '../../theme/colors';
import Toast from 'react-native-toast-message';

interface AssignBuildingModalProps {
  visible: boolean;
  onDismiss: () => void;
  doormanId: string;
  onAssignSuccess?: () => void;
  doorman?: IDoorman;
}

export const AssignBuildingModal = ({
  visible,
  onDismiss,
  doormanId,
  onAssignSuccess,
  doorman,
}: AssignBuildingModalProps) => {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchBuildingsAndCurrentAssignment = useCallback(async () => {
    try {
      const buildingsResponse = await buildingService.getAllBuildings();
      setBuildings(buildingsResponse);

      // If doorman has assigned buildings, select the first one
      if (doorman?.buildings && doorman.buildings.length > 0) {
        const buildingId = doorman.buildings[0]._id;
        console.log('Setting new building:', buildingId);
        setSelectedBuilding(buildingId);
      } else {
        setSelectedBuilding('');
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to fetch data',
      });
    }
  }, [doorman]);

  useEffect(() => {
    if (visible && doormanId) {
      console.log('Modal opened with doormanId:', doormanId);
      fetchBuildingsAndCurrentAssignment();
    }
  }, [visible, doormanId, fetchBuildingsAndCurrentAssignment]);

  // Add effect to monitor selectedBuilding changes
  useEffect(() => {
    console.log('selectedBuilding changed:', selectedBuilding);
  }, [selectedBuilding]);

  const handleAssign = async () => {
    if (!selectedBuilding) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select a building',
      });
      return;
    }

    setLoading(true);
    try {
      await doormanService.assignDoorman(selectedBuilding, doormanId);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Doorman assigned successfully',
      });
      onAssignSuccess?.();
      onDismiss();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to assign doorman',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAssignmentStatus = async () => {
    if (!selectedBuilding) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please select a building',
      });
      return;
    }

    setLoading(true);
    try {
      const currentBuilding = doorman?.buildings?.find(b => b._id === selectedBuilding);
      const isActive = currentBuilding?.status === 'active';

      if (isActive) {
        await doormanService.deactivateAssignment(selectedBuilding, doormanId);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Assignment deactivated successfully',
        });
      } else {
        await doormanService.activateAssignment(selectedBuilding, doormanId);
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Assignment activated successfully',
        });
      }
      onAssignSuccess?.();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.message || 'Failed to update assignment status',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Portal>
      <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.container}>
        <Text style={styles.title}>Assign to Building</Text>
        <ScrollView style={styles.buildingList}>
          <RadioButton.Group
            onValueChange={value => {
              console.log('Radio value changed:', value);
              setSelectedBuilding(value);
            }}
            value={selectedBuilding}
          >
            {buildings.map((building) => (
              <View key={building._id} style={styles.buildingItem}>
                <RadioButton.Item
                  label={building.name}
                  value={building._id}
                  labelStyle={styles.buildingLabel}
                />
              </View>
            ))}
          </RadioButton.Group>
        </ScrollView>
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={onDismiss}
            style={styles.button}
            textColor={colors.textPrimary}
          >
            Cancel
          </Button>
          {doorman?.buildings?.some(b => b._id === selectedBuilding) ? (
            <Button
              mode="contained"
              onPress={handleToggleAssignmentStatus}
              loading={loading}
              disabled={loading}
              style={styles.button}
              buttonColor={colors.red}
              textColor={colors.white}
            >
              {doorman.buildings.find(b => b._id === selectedBuilding)?.status === 'active'
                ? 'Deactivate'
                : 'Activate'}
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={handleAssign}
              loading={loading}
              disabled={loading}
              style={styles.button}
              buttonColor={colors.red}
              textColor={colors.white}
            >
              Assign
            </Button>
          )}
        </View>
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: 20,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  buildingList: {
    maxHeight: 400,
  },
  buildingItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  buildingLabel: {
    color: colors.textPrimary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    gap: 8,
  },
  button: {
    minWidth: 100,
  },
});
