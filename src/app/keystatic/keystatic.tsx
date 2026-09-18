// src/app/keystatic/keystatic.tsx
"use client";

import { makePage } from "@keystatic/next/ui/app";
import config from "../../../keystatic.config";

// é exportada a interface gráfica gerada
export default makePage(config);