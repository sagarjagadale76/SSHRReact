import * as React from "react";
import axios from "axios";
import { useToast } from "../hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  recordId: string | number;
  recordName?: string;
  apiEndpoint: string;
  onDeleteSuccess?: (recordId: string) => void;
}

export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  recordId,
  recordName,
  apiEndpoint,
  onDeleteSuccess,
}: DeleteConfirmationDialogProps) => {
  const { toast } = useToast();
  let navigate = useNavigate();
  const API_ENDPOINT =
    "https://anct398hbl.execute-api.eu-west-2.amazonaws.com/DEV/DeleteRoutingRule?id=" +
    recordId;

  const handleDelete = async () => {
    try {
      axios({
        method: "DELETE",
        url: API_ENDPOINT,
        headers: {
          "x-api-key": "TYXQrJvtOT1ac268C3eb0962We9XUlJu1Dls8Rvu",
        },
      }).then(async (response) => {
        console.log("Check response:", response);

        toast({
          title: "Success",
          description: `Record ${
            recordName || recordId
          } has been deleted successfully.`,
        });

        onDeleteSuccess?.(recordId.toString());
        onClose();
      });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete the record. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete{" "}
            {recordName ? `"${recordName}"` : "this record"} from the system.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
