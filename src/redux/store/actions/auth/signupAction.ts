import { config } from "@/common/configurations";
import { SignupFormData } from "@/types/forms";
import { CLIENT_API } from "@/utils/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosError } from "axios";

export const signupAction = createAsyncThunk(
	"user/signup",
	async (data: SignupFormData, {rejectWithValue }) => {
		try {
			const response = await CLIENT_API.post("/api/auth/signup", data, config);

			if (response.data.success) {
				return response.data;
			} else {
				return rejectWithValue(response.data);
			}
		} catch (error: any) {
            const e : any = error as AxiosError
            throw new Error(e.response?.data.error || e.response?.data.message || e.message);
        }
	}
);
