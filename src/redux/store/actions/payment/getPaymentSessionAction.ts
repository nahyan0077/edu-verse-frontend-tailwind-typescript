import { config } from "@/common/configurations";
import { CLIENT_API } from "@/utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const getPaymentSessionAction = createAsyncThunk(
	"course/getPaymentSession",
	async (id: string, { rejectWithValue }) => {
		try {
			const response = await CLIENT_API.post(
				`/api/payment/session/${id}`,
				config
			);
			if (response.data.success) {
				return response.data;
			} else {
				return rejectWithValue(response.data);
			}
		} catch (error: any) {
			console.log("Get payment session action Error: ", error);
			const e: AxiosError = error as AxiosError;
			return rejectWithValue(e.response?.data || e.message);
		}
	}
);
