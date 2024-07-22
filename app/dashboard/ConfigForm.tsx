"use client"

import { useEffect, useMemo, useState } from "react";
import Select, { SelectOption } from "./components/form/select";
import Input from "./components/form/input";
import ColorPicker from "./components/form/colorPicker";
import ImageUploader from "./components/form/image";
import uploadFile from "@/lib/Storage/Vercel/Blob";
import { ClientConfig } from "@/lib/Database/ChatBotConfig/clientConfigDatabase";
import RichTextInput from "./components/form/richTextInput";


export default function ConfigForm() {
    // set form type
    const [formValues, setFormValue] = useState<ClientConfig>({
        client: ''
    })
    const [filesUploading, setFilesUploading] = useState<boolean | null>(null)
    const [configUpdateInProgress, setConfigUpdateInProgress] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // GET CLIENTS
    const clients: SelectOption[] = [
        { id: "", value: "Select A Client" },
        { id: "1", value: "HDFC" },
    ]

    const getClientCurrentConfig = async (clientId: string) => {
        setFormValue({ client: clientId })
        if (!parseInt(clientId)) return

        setIsLoading(true)
        await fetch('/api/config?clientConfigId=' + clientId, {
            method: "GET"
        }).then(async (res: Response) => {
            let response = await res.json()
            if (response.client_id) {
                setFormValue({
                    client: response.client_id,
                    welcomeText: {
                        text: response.welcome_text,
                        subText: response.welcome_subtext
                    },
                    icon: {
                        client: (response.icon_client && response.icon_client != '.') ? response.icon_client : '',
                        bot: (response.icon_bot && response.icon_bot != '.') ? response.icon_bot : ''
                    },
                    logo: {
                        client: (response.logo_client && response.logo_client != '.') ? response.logo_client : '',
                        customer: (response.logo_customer && response.logo_customer != '.') ? response.logo_customer : '',
                    },
                    favicon: (response.favicon && response.favicon != '.') ? response.favicon : '',
                    title: response.title,
                    theme: response.theme,
                    instructions: response.instructions,
                })
                setIsLoading(false)
            }
        })
    }

    const updateValue = (key: string, value: File | string) => {

        setFormValue((prevFormValues: any) => {
            const keys = key.split('.');
            const updatedValues = { ...prevFormValues };

            let current = updatedValues;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) {
                    current[keys[i]] = {};
                }
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;

            return updatedValues;
        });
    }

    const onSubmit = async () => {
        let dateTime = new Date().toISOString()
        if (formValues) {
            setFilesUploading(true)
            await Promise.all([
                toBeUploaded(formValues.favicon) ? uploadFile('chatbot/favicon/' + dateTime + ".jpg", formValues.favicon as File) : Promise.resolve(),
                toBeUploaded(formValues.icon?.client) ? uploadFile('chatbot/icons/client/' + dateTime + ".jpg", formValues.icon?.client as File) : Promise.resolve(),
                toBeUploaded(formValues.icon?.bot) ? uploadFile('chatbot/icons/bot/' + dateTime + ".jpg", formValues.icon?.bot as File) : Promise.resolve(),
                toBeUploaded(formValues.logo?.client) ? uploadFile('chatbot/logo/client/' + dateTime + ".jpg", formValues.logo?.client as File) : Promise.resolve(),
                toBeUploaded(formValues.logo?.customer) ? uploadFile('chatbot/logo/customer/' + dateTime + ".jpg", formValues.logo?.customer as File) : Promise.resolve()
            ]).then(async responses => {
                console.log(responses)
                responses[0] && updateValue('favicon', responses[0])
                responses[1] && updateValue('icon.client', responses[1])
                responses[2] && updateValue('icon.bot', responses[2])
                responses[3] && updateValue('logo.client', responses[3])
                responses[4] && updateValue('logo.customer', responses[4])
                setFilesUploading(false)
            })
        }
    }


    useMemo(async () => {
        if (filesUploading == false && !configUpdateInProgress) {
            setConfigUpdateInProgress(true)
            await fetch('/api/config', {
                method: "POST",
                body: JSON.stringify(formValues),
            }).then(() => { setConfigUpdateInProgress(false) })
        }
    }, [filesUploading])

    const toBeUploaded = (file: string | File | undefined) => {
        return (file && file instanceof File)
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h1 className="text-2xl font-semibold mb-6 text-gray-800">Dashboard</h1>

                <form>
                    <div className="mb-4">
                        <label htmlFor="client" className="block text-gray-700">Select Client:</label>
                        <Select options={clients} selected={formValues?.client} setSelected={(value: string) => getClientCurrentConfig(value)} />
                        { isLoading && <div>
                            Loading...
                        </div> }
                    </div>
                    {
                        formValues?.client && (!isLoading) && (
                            <>
                                <div className="mb-4">
                                    <label htmlFor="title" className="block text-gray-700">Title:</label>
                                    <Input id="title" value={formValues?.title || ""} onChange={(value: string) => updateValue('title', value)} />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="fav-icon" className="block text-gray-700">Fav Icon:</label>
                                    <ImageUploader id="fav-icon" value={formValues?.favicon as string} onChange={(value: File | string) => updateValue('favicon', value)} />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="theme" className="block text-gray-700">Theme:</label>
                                    <ColorPicker id="theme" value={formValues?.theme || ""} onChange={(value: string) => updateValue('theme', value)} />
                                </div>

                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Chatbot icons:</h2>

                                <div className="mb-4">
                                    <label htmlFor="client-icon" className="block text-gray-700">Client Icon:</label>
                                    <ImageUploader id="client-icon" value={formValues?.icon?.client as string} onChange={(value: File | string) => updateValue('icon.client', value)} />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="bot-icon" className="block text-gray-700">Bot Icon:</label>
                                    <ImageUploader id="bot-icon" value={formValues?.icon?.bot as string} onChange={(value: File | string) => updateValue('icon.bot', value)} />

                                </div>

                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Logo:</h2>

                                <div className="mb-4">
                                    <label htmlFor="client-logo" className="block text-gray-700">Client Logo:</label>
                                    <ImageUploader id="client-logo" value={formValues?.logo?.client as string} onChange={(value: File | string) => updateValue('logo.client', value)} />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="customer-logo" className="block text-gray-700">Company Logo:</label>
                                    <ImageUploader id="customer-logo" value={formValues?.logo?.customer as string} onChange={(value: File | string) => updateValue('logo.customer', value)} />
                                </div>

                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Welcome message:</h2>

                                <div className="mb-4">
                                    <label htmlFor="welcome-text" className="block text-gray-700">Text:</label>
                                    <Input id="welcome-text" value={formValues?.welcomeText?.text} onChange={(value: string) => updateValue('welcomeText.text', value)} />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="welcome-subtext" className="block text-gray-700">Sub Text:</label>
                                    <Input id="welcome-subtext" value={formValues?.welcomeText?.subText} onChange={(value: string) => updateValue('welcomeText.subText', value)} />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="welcome-subtext" className="block text-gray-700">Instructions:</label>
                                    <RichTextInput id="welcome-subtext" value={formValues?.instructions} onChange={(value: string) => updateValue('instructions', value)} />
                                </div>

                                <button type="button" className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                                    onClick={onSubmit}
                                >Submit</button>
                            </>
                        )
                    }
                </form>
            </div>
        </div>
    )
}