import React from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";

import { testData } from "./TestData";
import CardStack from "@/components/CardStack";

const Base = () => {
  const [selectedGroup, setSelectedGroup] = React.useState<number | null>(null);

  const handleCardPress = (groupIndex: number) => {
    setSelectedGroup(groupIndex);
    console.log(`Pressed group at index: ${groupIndex}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Card Stack Demo</Text>

      {/* Display selected group info */}
      <View style={styles.infoContainer}>
        {selectedGroup !== null ? (
          <Text style={styles.infoText}>
            Selected Group: {selectedGroup + 1}
          </Text>
        ) : (
          <Text style={styles.placeholderText}>Tap a card group to select</Text>
        )}
      </View>

      {/* Spacer before the card stack */}
      <View style={styles.spacer} />

      {/* Card Stack Component */}
      <CardStack
        data={testData}
        renderCard={(item, groupIndex, cardIndex) => (
          <View style={{ padding: 10 }}>
            <Text>{item.city}</Text>
          </View>
        )}
        cardHeight={400}
        cardPadding={50}
        cardSpace={10}
        topOffset={200}
        onCardPress={handleCardPress}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
    textAlign: "center",
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  infoText: {
    fontSize: 18,
    color: "#fff",
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
  },
  spacer: {
    height: 200, // Reduced from 300 for better balance
  },
  cardContent: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    height: "100%", // Ensure it fills the card height
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 14,
    color: "#333",
  },
});

export default Base;
