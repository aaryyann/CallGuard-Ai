"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function UploadCallDialog() {
    const [isUploading, setIsUploading] = useState(false);
    const [formData, setFormData] = useState({
        patient: "",
        doctor: "",
        callDate: "",
        file: null as File | null,
    });

    const { toast } = useToast();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (!selectedFile.type.startsWith('audio/')) {
                toast({
                    title: "Invalid file type",
                    description: "Please upload an audio file",
                    variant: "destructive",
                });
                return;
            }
            setFormData({...formData , file : selectedFile});
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.file || !formData.patient) {
            toast({
                title: "Missing information",
                description: "Please provide at least a file and patient name",
                variant: "destructive",
            });
            return;
        }

        setIsUploading(true);

        try {

            const formDataToSend = new FormData();
            formDataToSend.append("file", formData.file);
            formDataToSend.append("patientName", formData.patient);
            formDataToSend.append("doctorName", formData.doctor);
            formDataToSend.append("callDate", formData.callDate);

            const response = await fetch(`/api/call-upload`, {
                method: 'POST',
                body: formDataToSend,
            });
            const data = await response.json();
            if (!response.ok) {
                toast({
                    title: "Error uploading call",
                    description: data.message || "Please try again later",
                    variant: "destructive",
                });
                return;
            }

            toast({
                title: "Call uploaded successfully",
                description: "The call will be analyzed shortly.",
            });
            

            // Reset form
            setFormData({
                patient: "",
                doctor: "",
                callDate: "",
                file: null,
            });
        } catch (error) {
            toast({
                title: "Error uploading call",
                description: "Please try again later",
                variant: "destructive",
            });
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size="lg">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload New Call
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Upload Patient Call</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="patient">Patient Name*</Label>
                            <Input
                                id="patient"
                                name="patient"
                                value={formData.patient}
                                onChange={handleInputChange}
                                placeholder="Enter patient name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="doctor">Doctor Name</Label>
                            <Input
                                id="doctor"
                                name="doctor"
                                value={formData.doctor}
                                onChange={handleInputChange}
                                placeholder="Enter doctor name"
                            />
                        </div>
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="calldate">Date of Call</Label>
                        <Input
                            id="callDate"
                            name="callDate"
                            type="datetime-local"
                            value={formData.callDate}
                            onChange={handleInputChange}
                            placeholder="Enter date and time"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">Call Recording*</Label>
                        <div className="border-2 border-dashed rounded-lg p-4 text-center">
                            <Input
                                id="file"
                                type="file"
                                accept="audio/*"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                            <label
                                htmlFor="file"
                                className="cursor-pointer flex flex-col items-center gap-2"
                            >
                                <Upload className="h-8 w-8 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    {formData.file ? formData.file.name : "Click to upload or drag and drop"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    Supported formats: MP3, WAV, M4A
                                </span>
                            </label>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isUploading}>
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            'Upload Call'
                        )}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}