import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { colors } from '../../../theme/colors';
import { fetchActivePlans } from '../../../store/slices/planSlice';
import type { AppDispatch, RootState } from '../../../store'; // You'll need to create these types
import { activePlanService } from '../../../services/activePlan.service';
import Toast from 'react-native-toast-message';

interface PricingCardProps {
  plan: {
    _id: string;
    planName: string;
    price: number;
    buildingCredit: number;
    userCredit: number;
    monthlyVisits: number;
  };
  isPopular?: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, isPopular }) => {
  const [showModal, setShowModal] = React.useState(false);

  const handleSubscription = async () => {
    try {
      await activePlanService.createActivePlan(plan._id);
      setShowModal(false);
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Plan activated successfully!',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to activate plan. Please try again.',
      });
    }
  };

  return (
    <View style={[styles.card, isPopular && styles.popularCard]}>
      <Text style={styles.cardTitle}>{plan.planName}</Text>
      <Text style={styles.monthly}>Monthly</Text>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{plan.price}</Text>
        <Text style={styles.currency}>AED</Text>
      </View>

      <View style={styles.featuresContainer}>
        <Text style={styles.feature}>{plan.buildingCredit} Buildings</Text>
        <Text style={styles.feature}>{plan.userCredit} Doormans</Text>
        <Text style={styles.feature}>{plan.monthlyVisits.toLocaleString()} Monthly Visits</Text>
        <Text style={[styles.feature, !isPopular && styles.inactiveFeature]}>
          Analytics Report
        </Text>
        <Text style={[styles.feature, !(isPopular && plan.planName === 'Pro Plan') && styles.inactiveFeature]}>
          Public API Access
        </Text>
        <Text style={[styles.feature, plan.planName !== 'Pro Plan' && styles.inactiveFeature]}>
          Plugins Integration
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, isPopular && styles.popularButton]}
        onPress={() => setShowModal(true)}
      >
        <Text style={[styles.buttonText, isPopular && styles.popularButtonText]}>
          Get Started
        </Text>
      </TouchableOpacity>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Subscription</Text>
            <Text style={styles.modalText}>
              Are you sure you want to subscribe to {plan.planName}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.approveButton]}
                onPress={handleSubscription}
              >
                <Text style={[styles.modalButtonText, styles.approveButtonText]}>
                  Approve
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={() => {/* Handle trial */}}>
        <Text style={styles.trialText}>Start Your 15 Day Free Trial</Text>
      </TouchableOpacity>
    </View>
  );
};

export const Pricing = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { plans, loading, error } = useSelector((state: RootState) => state.plans);

  useEffect(() => {
    dispatch(fetchActivePlans());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.red} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error loading plans: {error}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Plan & Pricing</Text>
      <View style={styles.cardsContainer}>
        {plans.map((plan, index) => (
          <PricingCard
            key={plan._id || `plan-${index}`}
            plan={plan}
            isPopular={index === 1}
          />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 24,
    marginHorizontal: 16,
  },
  cardsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  popularCard: {
    borderColor: colors.red,
    borderWidth: 2,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  monthly: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'baseline',
    marginBottom: 24,
  },
  price: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.red,
  },
  currency: {
    fontSize: 20,
    color: colors.red,
    marginLeft: 4,
  },
  featuresContainer: {
    marginBottom: 24,
  },
  feature: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  inactiveFeature: {
    color: '#999',
  },
  button: {
    backgroundColor: colors.white,
    borderColor: colors.red,
    borderWidth: 2,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  popularButton: {
    backgroundColor: colors.red,
  },
  buttonText: {
    color: colors.red,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  popularButtonText: {
    color: colors.white,
  },
  trialText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 20,
  },
  errorText: {
    color: colors.red,
    textAlign: 'center',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  approveButton: {
    backgroundColor: colors.red,
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  approveButtonText: {
    color: colors.white,
  },
});
