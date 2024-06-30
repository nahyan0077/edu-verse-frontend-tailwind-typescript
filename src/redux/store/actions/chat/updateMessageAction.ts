import { config } from "@/common/configurations";
import { CLIENT_API } from "@/utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const updateMessageAction = createAsyncThunk(
    "chat/updateMessage",
    async (
        data: any
    ,{rejectWithValue}) => {
        try {

			console.log(data,"delet messsage data");
			

            const response = await CLIENT_API.put(
                `/api/chat/message`,data,config
            );

			if (response.data.success) {
				return response.data;
			} else {
				return rejectWithValue(response.data);
			}
		} catch (error) {
			console.log("Fetch enrollment action Error: ", error);
			const e: AxiosError = error as AxiosError;
			return rejectWithValue(e.response?.data || e.message);
		}
    }
)