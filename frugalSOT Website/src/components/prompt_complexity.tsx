import { Card, CardContent } from "@/components/ui/card"

export default function FrugalSOTFormulaCard() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      <Card className="bg-transparent shadow-2xl overflow-hidden">

        <CardContent className="p-0">
          <div className="flex min-h-[700px]">
            {/* Left Column - Image */}
            <div className="flex-1 bg-transparent p-8 flex items-center justify-center">
              <div className="w-full max-w-lg">
                <img
                  src="/prompt_complexity_analysis (3)_PhotoGrid.png"
                  alt="FrugalSOT Prompt Complexity Classification Workflow"
                  className="w-full h-auto rounded-lg shadow-lg border-2 border-yellow-400"
                />
              </div>
            </div>

            {/* Right Column - Mathematical Formulas */}
            <div className="flex-1 bg-black text-white p-8 overflow-y-auto">
              <div className="space-y-6">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-yellow-400">Mathematical Framework</h2>
                  <p className="text-gray-300 text-sm mt-2">Complexity Classification Formulas</p>
                </div>

                {/* Length Complexity */}
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    Length Complexity (LC)
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-black/50 p-3 rounded border border-yellow-400/20">
                      <div className="text-yellow-300 font-mono text-sm">
                        {"LC = { Low if L ≤ 5, Mid if 6 ≤ L ≤ 10, High if L > 10 }"}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Where <span className="text-yellow-400 font-semibold">L</span> represents the word count of the
                      input prompt.
                    </p>
                  </div>
                </div>

                {/* NER Complexity */}
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    NER Complexity (NERC)
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-black/50 p-3 rounded border border-yellow-400/20">
                      <div className="text-yellow-300 font-mono text-sm">
                        {"NERC = { Low if Ce = 0, Mid if 1 ≤ Ce ≤ 3, High if Ce > 3 }"}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Where <span className="text-yellow-400 font-semibold">Ce</span> is the count of named entities in
                      the prompt.
                    </p>
                  </div>
                </div>

                {/* Syntactic Complexity */}
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    Syntactic Complexity (SC)
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-black/50 p-3 rounded border border-yellow-400/20">
                      <div className="text-yellow-300 font-mono text-sm">{"S = Cc + Cs + δ(Ls > 12)"}</div>
                    </div>
                    <div className="bg-black/50 p-3 rounded border border-yellow-400/20">
                      <div className="text-yellow-300 font-mono text-sm">
                        {"SC = { Low if S = 0, Mid if 1 ≤ S ≤ 2, High if S > 2 }"}
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm space-y-1">
                      <p>
                        <span className="text-yellow-400 font-semibold">Cc</span> = conjunction count
                      </p>
                      <p>
                        <span className="text-yellow-400 font-semibold">Cs</span> = subordinate clause count
                      </p>
                      <p>
                        <span className="text-yellow-400 font-semibold">δ(Ls {">"} 12)</span> = 1 if avg sentence length{" "}
                        {">"} 12 words
                      </p>
                    </div>
                  </div>
                </div>

                {/* Final Weighted Score */}
                <div className="bg-yellow-400/20 border-2 border-yellow-400 rounded-lg p-4">
                  <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    Final Weighted Score
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-black/50 p-3 rounded border border-yellow-400/20">
                      <div className="text-yellow-300 font-mono text-sm">{"C = 1 × LC + 2 × NERC + 3 × SC"}</div>
                    </div>
                    <div className="bg-black/50 p-3 rounded border border-yellow-400/20">
                      <div className="text-yellow-300 font-mono text-sm">
                        {"Overall Complexity = { Low if C ≤ 4, Mid if 5 ≤ C ≤ 8, High if C ≥ 9 }"}
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm">
                      Complexity levels: <span className="text-yellow-400">Low=0, Mid=2, High=4</span>
                    </p>
                  </div>
                </div>

                {/* Adaptive Threshold */}
                <div className="bg-yellow-400/10 border border-yellow-400/30 rounded-lg p-4">
                  <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    Adaptive Threshold
                  </h3>
                  <div className="space-y-2">
                    <div className="bg-black/50 p-3 rounded border border-yellow-400/20">
                      <div className="text-yellow-300 font-mono text-sm">{"Tnew = α × R + (1-α) × Told"}</div>
                    </div>
                    <div className="text-gray-300 text-sm space-y-1">
                      <p>
                        <span className="text-yellow-400 font-semibold">α = 0.2</span> (adaptation factor)
                      </p>
                      <p>
                        <span className="text-yellow-400 font-semibold">R</span> = relevance score
                      </p>
                      <p>
                        <span className="text-yellow-400 font-semibold">Told</span> = previous threshold
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
