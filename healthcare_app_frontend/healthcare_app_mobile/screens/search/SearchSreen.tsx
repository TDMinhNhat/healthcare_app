import React, { useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import BackButton from "../../components/BackButton";
import SearchBox from "../../components/SearchBox";
import { DoctorCard } from "../../components/DoctorCard";

const SearchScreen = () => {
  const searchInputRef = useRef<TextInput>(null);
  const [searchText, setSearchText] = React.useState("");
  const [searchResults, setSearchResults] = React.useState<any[]>([]);
  const [hasSearched, setHasSearched] = React.useState(false);

  // Focus on search input when screen is loaded
  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
    setHasSearched(true);
    // Mock search results - replace with actual API call
    if (text.length > 0) {
      setSearchResults([
        {
          id: 1,
          name: "Dr. John Doe",
          specialty: "Cardiologist",
          qualifications: "MBBS, MD",
          rating: 4.8,
          imageUrl: "https://example.com/doctor1.jpg",
        },
        // Add more mock results as needed
      ]);
    } else {
      setSearchResults([]);
    }
  };

  const renderContent = () => {
    if (!hasSearched) {
      return (
        <View style={styles.centerContent}>
          {/* <Image
            source={require("../../assets/search-initial.png")}
            style={styles.initialImage}
          /> */}
          <Text style={styles.initialText}>
            Search for doctors, specialties, symptoms...
          </Text>
        </View>
      );
    }

    if (searchResults.length === 0) {
      return (
        <View style={styles.centerContent}>
          {/* <Image
            source={require("../../assets/no-results.png")}
            style={styles.noResultsImage}
          /> */}
          <Text style={styles.noResultsTitle}>No Results Found</Text>
          <Text style={styles.noResultsText}>
            We couldn't find what you're looking for. Try different keywords.
          </Text>
        </View>
      );
    }

    return (
      <ScrollView style={styles.resultsList}>
        <Text style={styles.resultsCount}>
          {searchResults.length} results found
        </Text>
        {searchResults.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            name={doctor.name}
            specialty={doctor.specialty}
            qualifications={doctor.qualifications}
            rating={doctor.rating}
            imageUrl={doctor.imageUrl}
          />
        ))}
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <BackButton />
        <View style={styles.searchContainer}>
          <SearchBox
            ref={searchInputRef}
            value={searchText}
            onChangeText={handleSearch}
            placeholder="Search..."
            onSubmit={() => {}}
          />
        </View>
      </View>
      {renderContent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  searchContainer: {
    flex: 1,
    marginLeft: 12,
  },
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  initialImage: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  initialText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  noResultsImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  resultsList: {
    flex: 1,
    padding: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
});

export default SearchScreen;
