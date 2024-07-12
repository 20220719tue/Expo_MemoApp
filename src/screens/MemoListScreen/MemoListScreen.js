import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";

const MemoListScreen = () => {
  const navigation = useNavigation();
  const [memos, setMemos] = useState([]);

  const fetchMemos = useCallback(async () => {
    try {
      let storedMemos = await AsyncStorage.getItem("memos");
      storedMemos = storedMemos ? JSON.parse(storedMemos).reverse() : [];
      setMemos(storedMemos);
    } catch (error) {
      console.error("메모를 가져오는데 에러 발생:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchMemos();
    }, [fetchMemos])
  );

  const navigateToMemoDetails = (item) => {
    navigation.navigate("MemoFormScreen", { item }); // 전달 시 객체로 감싸기
  };

  const deleteMemo = async (id) => {
    try {
      const updatedMemos = memos.filter((memo) => memo.id !== id);
      setMemos(updatedMemos);
      await AsyncStorage.setItem("memos", JSON.stringify(updatedMemos));
    } catch (error) {
      console.error("메모를 삭제하는데 에러 발생:", error);
    }
  };

  return (
    <View style={styles.container}>
      {memos.length === 0 ? (
        <Text style={styles.emptyText}>메모가 없습니다.</Text>
      ) : (
        <FlatList
          data={memos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.memoItem}
              onPress={() => navigateToMemoDetails(item)}
            >
              <Text>{item.title}</Text>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={(e) => {
                  e.stopPropagation(); // 내부 버튼 클릭 시 상위 View 클릭 방지
                  deleteMemo(item.id);
                }}
              >
                <Image
                  source={require("../../images/deleteButton_red.png")}
                  style={{ width: 24, height: 24, margin: 5 }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#DBB5B5" },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
    color: "#A87676",
    fontWeight: "bold",
  },
  memoItem: {
    backgroundColor: "#F1E5D1",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  deleteButton: {
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "white",
  },
});

export default MemoListScreen;
