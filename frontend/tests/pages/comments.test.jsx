// creating tests to see if comments POST correctly to database
// new database "Comments" to be created as well for all to pass
// hardcoding values for the moment until BE creates table in DB

import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";
import { CreateComment } from "../components/CommentsBox/CommentsBox";
import { commentCreate } from "../../src/services/createcomment";
