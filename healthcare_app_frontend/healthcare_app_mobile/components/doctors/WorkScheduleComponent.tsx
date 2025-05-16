import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Agenda } from "react-native-calendars";
import moment from "moment";

export default function WorkScheduleComponent() {
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    loadSchedule();
  }, [selectedDate]);

  function loadSchedule() {
    const allEvents = {
      "2025-03-18": [{ name: "Team Meeting", time: "10:00 AM" }],
      "2025-03-19": [{ name: "Doctor Visit", time: "02:00 PM" }],
      "2025-03-22": [{ name: "Conference Call", time: "04:00 PM" }],
      "2025-03-26": [{ name: "Project Deadline", time: "11:59 PM" }],
    };
    const newSchedule = { [selectedDate]: allEvents[selectedDate] || [] };
    console.log(selectedDate);
    setSchedule(newSchedule);
  }

  function clickNextWeek() {
    setSelectedDate(
      moment(selectedDate)
        .add(7, "days")
        .startOf("isoWeek")
        .format("YYYY-MM-DD")
    );
  }

  function clickPreviousWeek() {
    setSelectedDate(
      moment(selectedDate)
        .subtract(7, "days")
        .startOf("isoWeek")
        .format("YYYY-MM-DD")
    );
  }

  function clickCurrentWeek() {
    setSelectedDate(moment().format("YYYY-MM-DD"));
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={clickPreviousWeek}>
          <Text style={styles.buttonText}>Tuần Trước</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={clickCurrentWeek}>
          <Text style={styles.buttonText}>Tuần Hiện Tại</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={clickNextWeek}>
          <Text style={styles.buttonText}>Tuần Sau</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1 }}>
        <Agenda
          firstDay={1}
          items={schedule}
          selected={selectedDate}
          renderItem={(item: object) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>{item.name}</Text>
              <Text style={styles.itemTime}>{item.time}</Text>
            </View>
          )}
          onDayPress={(day: object) => {
            setSelectedDate(
              moment(day.dateString).startOf("isoWeek").format("YYYY-MM-DD")
            );
          }}
          renderEmptyData={() => (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No events for today</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  button: { backgroundColor: "#007AFF", padding: 10, borderRadius: 10 },
  buttonText: { color: "#fff", fontSize: 16 },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 15,
    borderRadius: 10,
    margin: 10,
  },
  itemText: { fontSize: 16, fontWeight: "bold" },
  itemTime: { fontSize: 14, color: "#555" },
  empty: { padding: 20, alignItems: "center" },
  emptyText: { fontSize: 16, color: "#aaa" },
});
