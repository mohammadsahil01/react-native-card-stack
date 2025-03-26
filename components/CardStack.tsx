import React from "react";
import {
  Animated,
  Dimensions,
  FlatListProps,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

// Props interface for the CardStack component
interface CardStackProps<T> {
  data: T[][]; // Array of card groups (each group is an array of cards)
  renderCard: (item: T, groupIndex: number, cardIndex: number) => JSX.Element; // Function to render each card
  cardHeight?: number; // Height of each card
  cardPadding?: number; // Padding between card groups
  cardSpace?: number; // Space between cards within a group
  topOffset?: number; // Initial top offset for the stack animation
  keyExtractor?: (item: T[], groupIndex: number) => string; // Key extractor for groups
  cardKeyExtractor?: (item: T, cardIndex: number, groupIndex: number) => string; // Key extractor for cards within a group
  onCardPress?: (groupIndex: number) => void; // Callback when a card group is pressed
  flatListProps?: Partial<FlatListProps<T[]>>; // Additional props for the outer FlatList
  innerFlatListProps?: Partial<FlatListProps<T>>; // Additional props for the inner FlatList
}

/**
 * A customizable card stack component with animated scrolling.
 * Displays groups of cards that animate as the user scrolls, with inner card animations.
 * Limits each group to a maximum of 3 cards.
 * @template T The type of data for each card
 */
const CardStack = <T,>({
  data,
  renderCard,
  cardHeight = 400,
  cardPadding = 57,
  cardSpace = 6,
  topOffset = Dimensions.get("window").height * 0.35,
  keyExtractor,
  cardKeyExtractor,
  onCardPress,
  flatListProps,
  innerFlatListProps,
}: CardStackProps<T>) => {
  const y = React.useRef(new Animated.Value(0)).current;
  const y2 = React.useRef(new Animated.Value(0)).current;

  // Interpolate for the entire card stack to move up after the topOffset space is scrolled
  const scrollOffsetY = y.interpolate({
    inputRange: [0, topOffset],
    outputRange: [0, -topOffset],
    extrapolate: "clamp",
  });

  return (
    <Animated.View style={{ transform: [{ translateY: scrollOffsetY }] }}>
      <Animated.FlatList
        bounces={false}
        scrollEventThrottle={16}
        data={data}
        showsVerticalScrollIndicator={false}
        keyExtractor={keyExtractor || ((_, index) => `${index}`)}
        contentContainerStyle={styles.contentContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: y } } }],
          { useNativeDriver: true }
        )}
        renderItem={({ item: cardGroup, index: groupIndex }) => {
          const inputRange = [-cardHeight, 0];
          const outputRange = [
            cardHeight * groupIndex,
            (cardHeight - cardPadding) * -groupIndex,
          ];

          if (groupIndex > 0) {
            inputRange.push(cardPadding * groupIndex);
            outputRange.push(cardHeight * -groupIndex);
          }

          const translateY = Animated.add(
            y,
            y.interpolate({
              inputRange: inputRange,
              outputRange: outputRange,
              extrapolateRight: "clamp",
            })
          );

          // Limit the card group to a maximum of 2 items
          const limitedCardGroup = cardGroup.slice(0, 2);

          return (
            <Animated.View
              style={[
                styles.card,
                { height: cardHeight, transform: [{ translateY }] },
              ]}
            >
              <TouchableOpacity
                style={styles.touchable}
                onPress={() => onCardPress?.(groupIndex)}
                activeOpacity={1}
              >
                <Animated.FlatList
                  data={limitedCardGroup} // Use the limited array here
                  keyExtractor={(item, index) =>
                    cardKeyExtractor?.(item, index, groupIndex) ||
                    `${groupIndex}-${index}`
                  }
                  renderItem={({ item: cardDetails, index: cardIndex }) => {
                    const inputRange2 = [-cardHeight, 0];
                    const outputRange2 = [
                      cardHeight * cardIndex,
                      (cardHeight - cardSpace) * -cardIndex,
                    ];

                    if (cardIndex > 0) {
                      inputRange2.push(cardPadding * cardIndex);
                      outputRange2.push(cardHeight * -cardIndex);
                    }

                    const translateY2 = Animated.add(
                      y2,
                      y2.interpolate({
                        inputRange: inputRange2,
                        outputRange: outputRange2,
                        extrapolateRight: "clamp",
                      })
                    );

                    return (
                      <Animated.View
                        style={{
                          backgroundColor: "white",
                          borderRadius: 8,
                          transform: [{ translateY: translateY2 }],
                        }}
                      >
                        <View style={[styles.propertyCard]}>
                          {renderCard(cardDetails, groupIndex, cardIndex)}
                        </View>
                      </Animated.View>
                    );
                  }}
                  {...innerFlatListProps}
                />
              </TouchableOpacity>
            </Animated.View>
          );
        }}
        {...flatListProps}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    alignItems: "center",
  },
  card: {
    paddingHorizontal: 16,
    width: Dimensions.get("window").width,
  },
  touchable: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 8,
  },
  propertyCard: {
    borderRadius: 11,
    height: 400,
    borderColor: "#AAAAAA",
    borderWidth: 1,
  },
});

export default CardStack;
