import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";

const MemoFormScreen = () => {
  const [memoTitle, setMemoTitle] = useState("");
  const [memoText, setMemoText] = useState("");
  const [memoId, setMemoId] = useState("");

  const navigation = useNavigation();
  const route = useRoute();
  let item = route.params?.item ?? []; // route.params에서 item을 가져오고 기본값을 빈 배열로 설정

  // useFocusEffect를 사용하여 화면이 포커스될 때마다 실행
  useFocusEffect(
    useCallback(() => {
      if (item) {
        // 아이템이 있을 경우 폼에 값을 설정
        setMemoTitle(item.title);
        setMemoText(item.text);
        setMemoId(item.id);
        item = [];
      } else {
        // 아이템이 없을 경우 폼을 빈 값으로 초기화
        setMemoTitle("");
        setMemoText("");
        setMemoId("");
      }
    }, [item]) // item이 변경될 때마다 실행
  );

  // id 생성함수
  const getCurrentDateTimeString = () => {
    const now = new Date();

    const year = now.getFullYear().toString();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");

    return year + month + day + hours + minutes + seconds;
  };

  // 메모저장
  const saveMemo = async () => {
    try {
      const id = memoId ? memoId : getCurrentDateTimeString();
      const newMemo = {
        id,
        title:
          memoTitle === undefined || memoTitle.trim() === "" ? id : memoTitle,
        text: memoText,
      };

      let memos = await AsyncStorage.getItem("memos");
      memos = memos ? JSON.parse(memos) : [];

      if (memoId) {
        // memoId가 존재하면 해당 메모를 업데이트
        const memoIndex = memos.findIndex((memo) => memo.id === memoId);
        if (memoIndex !== -1) {
          memos[memoIndex] = newMemo;
        }
      } else {
        // memoId가 존재하지 않으면 새로운 메모를 추가
        memos.push(newMemo);
      }

      await AsyncStorage.setItem("memos", JSON.stringify(memos));
      navigation.goBack();
    } catch (error) {
      console.error("메모 저장 오류 발생:", error);
    }
  };

  // 메모삭제
  const deleteMemo = async () => {
    try {
      let memos = await AsyncStorage.getItem("memos");
      memos = memos ? JSON.parse(memos) : [];

      if (memoId) {
        // memoId가 존재하면 해당 메모를 삭제
        const initialLength = memos.length;
        memos = memos.filter((memo) => memo.id !== memoId);

        // 메모가 실제로 삭제되었는지 확인
        if (initialLength === memos.length) {
          console.warn(`메모를 찾을 수 없습니다: ${memoId}`);
        }
      } else {
        console.warn("memoId가 제공되지 않았습니다.");
      }

      console.log("삭제 후 남은 메모들:", memos);

      await AsyncStorage.setItem("memos", JSON.stringify(memos));
      navigation.goBack();
    } catch (error) {
      console.error("메모 삭제 오류 발생:", error);
    }
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={deleteMemo}>
            <Image
              source={require("../../images/deleteButton_light.png")}
              style={{ width: 24, height: 24, margin: 5 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={saveMemo}>
            <Image
              source={require("../../images/saveButton.png")}
              style={{ width: 24, height: 24, margin: 5, marginRight: 15 }}
            />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, memoTitle, memoText]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input_title}
        placeholder="제목을 입력하세요."
        value={memoTitle}
        onChangeText={(text) => setMemoTitle(text)}
      />
      <TextInput
        style={[styles.input]}
        placeholder="메모를 입력하세요."
        multiline
        value={memoText}
        onChangeText={(text) => setMemoText(text)}
        textAlignVertical="top" // 텍스트를 상단에 정렬
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#DBB5B5" },
  input_title: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 10,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#F1E5D1",
  },
  input: {
    height: "80%",
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#F1E5D1",
  },
});

export default MemoFormScreen;
