import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import DeleteButton from '../../src/components/DeleteButton/DeleteButton';
import { deletePostByID } from '../../src/services/deletepost';

// Mocking the deletePost service
vi.mock("../../src/services/deletepost", () => {
  const deletePostByIDMock = vi.fn();
  return { deletePostByID: deletePostByIDMock };
});

// Reusable function for clicking the delete button
const clickDeleteButton = async () => {
      const user = userEvent.setup();
      const deleteButton = screen.getByRole("deletion");
      // Click the delete button
      await user.click(deleteButton);
};

describe('Delete button', () => {

    test('Delete button renders', async () => {

      //     const mockPosts = [{ _id: "12345", message: "Test Post 1" }];

      // Render the delete button
      render(<DeleteButton />);
      const deleteButton = await screen.findByRole("deletion");
      expect(deleteButton).toBeTruthy();
    })
    
    test('Delete button calls DeletePostByID on click', async () => {
      // Render the delete button
      const postID = '123';
      render(<DeleteButton postID={postID} />);
      console.log(deletePostByID())
      await clickDeleteButton();
    
      // Check if deletePostByID was called     
      expect(deletePostByID).toHaveBeenCalledOnce();
    })
  });